import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Upload, Icon, Progress, Checkbox, Spin, Radio, message } from 'antd';

import request from 'superagent'
import SparkMD5 from 'spark-md5'

import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import CONSTANT from '../../variables/CONSTANT';

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Tooltip
} from "reactstrap";

const confirm = Modal.confirm
const { Dragger } = Upload;

const chunkSize = CONSTANT.Chunk.size; //每次切片1M

const UPLOAD_SUCCESS = "finish"
const UPLOAD_WAITING = "uploading"
const UPLOAD_FAILED = "rsp_no"
const UPLOAD_OFFLINE = "offline"
const UPLOAD_NORMAL = "normal"
const UPLOAD_PAUSE = "pause"
const TRANS_SUCCESS = "finish"
const TRANS_WAITING = "waiting"
const TRANS_FAILED = "rsq_no"
const TRANS_OFFLINE = "offline"
const TRANS_UPLOADING = "uploding"
const TRANS_PAUSE = "pause"
const WAIT_TIME_MS = 5000
const FILE_STAT_IDLE = 0
const FILE_STAT_TRANS = 1
const FILE_STAT_DONE = 2
const FILE_STAT_FAILED = -1

class FileUpload extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props)
        this.state = {
            preUploading: false,   //预处理
            chunksSize: 0,   // 上传文件分块的总个数
            currentChunks: 0,  // 当前上传的块号
            uploadPercent: -1,  // 上传率
            preUploadPercent: -1, // 预处理率  
            uploadRequest: false, // 上传请求，即进行第一个过程中
            uploaded: false, // 表示文件是否上传成功
            uploading: false, // 上传中状态
            visibleConfirmModal: false,
            fileMD5: "",
            arrayFilesBufferData: [],
            arrayBufferData: [],
            uploadParams: {},
            arrayUploadParams: [],
            errorinfo: "",
            successinfo: "",
            visibleErrorModal: false,
            visibleSuccessModal: false,
            fileList: [],               //文件列表
            sthonFileList: false,       //有文件在列表上
            nowUploadingFile: -1,       //现在上传的文件 0-n
            transStat: "",              //trans请求状态
            uploadStat: "",             //upload请求状态
            successNum: 0,
            waitNum: 0,
            isPause: false,
        }

        this.toggleConfirmModal = this.toggleConfirmModal.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleTrans = this.handleTrans.bind(this);
        this.toggleErrorModal = this.toggleErrorModal.bind(this);
        this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
        this.controlUpload = this.controlUpload.bind(this);
        this.sleep = this.sleep.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
    }

    toggleConfirmModal() {
        var visibleConfirmModal = this.state.visibleConfirmModal;
        this.setState({
            visibleConfirmModal: !visibleConfirmModal
        })
    }

    toggleErrorModal() {
        var visibleErrorModal = this.state.visibleErrorModal;
        this.setState({
            visibleErrorModal: !visibleErrorModal, errorinfo: ""
        })
    }

    toggleSuccessModal() {
        // console.log('toggleSuccessModal')
        var visibleSuccessModal = this.state.visibleSuccessModal;
        this.setState({
            visibleSuccessModal: !visibleSuccessModal, successinfo: ""
        })
    }

    sleep(milliSeconds) {
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds) {
            // // console.log(new Date().getTime());
        }//暂停一段时间 10000=1S。
    }

    handlePause() {
        this.state.isPause = true
        const arrayUploadParams = this.state.arrayUploadParams
        for (var i = 0; i < arrayUploadParams.length; i++) {
            if(this.state.arrayUploadParams[i].file.stat === FILE_STAT_TRANS){
                this.state.arrayUploadParams[i].file.stat = FILE_STAT_IDLE
            }
        }
        // this.setState({
        //     isPause: true
        // })
    }

    handleContinue() {
        this.state.isPause = false
        this.controlUpload()
        // this.setState({
        //     isPause: false
        // })
    }

    async controlUpload() {
        // // console.log(this.state.arrayUploadParams)
        // console.log(this.state.arrayFilesBufferData)
        // console.log(this.state.arrayUploadParams)

        this.setState({ visibleConfirmModal: false })
        var arrayUploadParams = this.state.arrayUploadParams
        var nowUploadingFile = this.state.nowUploadingFile
        var arrayHandleUploadRes = []
        var handleUploadRes

        var errorinfo = this.state.errorinfo
        var successinfo = this.state.successinfo
        // var errArrayUploadParams = this.state.errArrayUploadParams;
        // var sucArrayUploadParams = this.state.sucArrayUploadParams;

        const fileNum = arrayUploadParams.length
        // console.log('fileNum: ' + fileNum)
        var successNum = this.state.successNum

        for (nowUploadingFile = 0; nowUploadingFile < fileNum; nowUploadingFile++) {
            // this.state.arrayUploadParams = arrayFilesBufferData[nowUploadingFile]
            // // console.log(arrayUploadParams)
            if (this.state.arrayUploadParams[nowUploadingFile].file.stat === FILE_STAT_IDLE) {
                this.state.arrayUploadParams[nowUploadingFile].file.stat = FILE_STAT_TRANS
                handleUploadRes = new Promise(async (resolve, reject) => {
                    const fileIndex = nowUploadingFile
                    // console.log(fileIndex)
                    var end = await this.handleUpload(arrayUploadParams[fileIndex], fileIndex)
                    resolve({ data: end, fileIndex: fileIndex })
                    // console.log(fileIndex)
                }).then((res) => {
                    // console.log(res.data)
                    // console.log(res.fileIndex)
                    switch (res.data) {
                        case UPLOAD_SUCCESS:
                            // console.log(UPLOAD_SUCCESS)
                            this.state.successNum++;
                            this.state.arrayUploadParams[res.fileIndex].file.stat = FILE_STAT_DONE
                            break;
                        case UPLOAD_FAILED:
                            // console.log(UPLOAD_FAILED)
                            // errArrayUploadParams.push(arrayUploadParams[fileIndex])
                            this.state.arrayUploadParams[res.fileIndex].file.stat = FILE_STAT_FAILED
                            break;
                        case UPLOAD_WAITING:
                            // console.log(UPLOAD_WAITING)
                            this.state.waitNum++;
                            this.state.arrayUploadParams[res.fileIndex].file.stat = FILE_STAT_IDLE
                            // TODO WAITING
                            break;
                        case UPLOAD_OFFLINE:
                            // console.log(UPLOAD_OFFLINE)
                            // errArrayUploadParams.push(arrayUploadParams[fileIndex])
                            this.state.arrayUploadParams[res.fileIndex].file.stat = FILE_STAT_FAILED
                            break;
                        case UPLOAD_PAUSE:
                            // console.log('Pause')
                            break;
                        default:
                            // console.log('default')
                            // errArrayUploadParams.push(arrayUploadParams[fileIndex])
                            this.state.arrayUploadParams[res.fileIndex].file.stat = FILE_STAT_FAILED
                            break;
                    }
                })
                arrayHandleUploadRes.push(handleUploadRes)
            }
        }
        await Promise.all(arrayHandleUploadRes).then((res) => {
            if (this.state.successNum === fileNum) {
                this.setState({
                    uploaded: true,
                    // uploadRequest: false,    // 上传请求成功
                    uploadPercent: 100,
                    uploading: false
                })
                for (var i = 0; i < arrayUploadParams.length; i++) {
                    if (this.state.arrayUploadParams[i].file.stat === FILE_STAT_DONE) {
                        successinfo += (this.state.arrayUploadParams[i].file.fileName + '\n')
                    }
                }
                successinfo += 'success'
                return UPLOAD_SUCCESS
            }else if(this.state.isPause){
                // console.log(UPLOAD_PAUSE)
                return UPLOAD_PAUSE
            }  else if (this.state.waitNum > 0) {
                this.state.waitNum = 0
                return UPLOAD_WAITING
            } else {
                for (var i = 0; i < arrayUploadParams.length; i++) {
                    if (this.state.arrayUploadParams[i].file.stat === FILE_STAT_FAILED) {
                        errorinfo += (this.state.arrayUploadParams[i].file.fileName + '\n')
                    }
                }
                // console.log('else')
                errorinfo += 'failed'
                return UPLOAD_FAILED
            }
        }).then((res) => {
            switch (res) {
                case UPLOAD_SUCCESS:
                    this.setState({
                        visibleSuccessModal: true, successinfo: successinfo
                    })
                    break;
                case UPLOAD_WAITING:
                    // console.log('waiting')
                    setTimeout(() => {
                        this.controlUpload()
                    }, 2000)         //等两秒再尝试
                    break;
                case UPLOAD_FAILED:
                    this.setState({
                        visibleErrorModal: true, errorinfo: errorinfo
                    })
                    break;
                case UPLOAD_PAUSE:
                    break;
            }
        })
    }

    async handleUpload(params, fileIndex) {
        // requestUrl,返回可以上传的分片队列
        //...
        if(this.state.isPause){
            return UPLOAD_PAUSE
        }
        const { cookies } = this.props;
        var url = CONSTANT.Urls.uploadUrl;
        const userid = cookies.get('userid')


        let { fileList } = this.state;
        // console.log(fileList)


        var chunk_send = "";
        var errorinfo = this.state.errorinfo;
        var handleTransRes;

        let upload_req = {
            cli_req: "upload",
            user_id: userid,
            parent_path: this.props.parentpath,
            md5: params.file.fileMd5,
            size: params.file.fileSize,
            name: params.file.fileName
        };

        var funRes;


        await fetch(url, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                // "Access-Control-Allow-Origin": "*",
                "Content-Type": "text/plain",  //"application/octet-stream"
                'Accept': 'text/plain'
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            mode: "cors",
            // body: formData,
            body: JSON.stringify(upload_req),
        }).then(res => res.json())
            .then(async (data) => {
                // console.log(data)
                if (data.ser_rsp === "ok") {
                    if (data.stat === "uploading") {
                        let uploadPercent = parseInt(data.process)
                        chunk_send = parseInt(data.chunk_send) - 1        //server端 从1开始
                        this.setState({
                            uploaded: false,    // 上传请求成功
                            currentChunks: chunk_send,
                            uploadPercent: 100 * uploadPercent / params.chunks.length,
                            uploading: true
                        })
                        // // console.log('this state')
                        var result;
                        handleTransRes = new Promise(async (resolve, reject) => {
                            var TransRes = await this.handleTrans(params, data.stat, chunk_send, fileIndex)
                            // console.log(TransRes)
                            resolve(TransRes);
                            // return TransRes
                        }).then((res) => {
                            // console.log(res)
                            switch (res) {
                                case TRANS_SUCCESS:
                                    return TRANS_SUCCESS;
                                case TRANS_FAILED:
                                    return TRANS_FAILED;
                                case TRANS_WAITING:
                                    return TRANS_WAITING;
                                case TRANS_OFFLINE:
                                    return TRANS_OFFLINE;
                                case TRANS_PAUSE:
                                    return TRANS_PAUSE;
                                default:
                                    return TRANS_FAILED;
                            }
                        }).then((data) => {
                            // console.log(data)
                            switch (data) {
                                case TRANS_SUCCESS:
                                    result = UPLOAD_SUCCESS;
                                    break;
                                case TRANS_FAILED:
                                    result = UPLOAD_FAILED;
                                    break;
                                case TRANS_WAITING:
                                    result = UPLOAD_WAITING;
                                    break;
                                case TRANS_OFFLINE:
                                    result = UPLOAD_OFFLINE;
                                    break;
                                case TRANS_PAUSE:
                                    result = UPLOAD_PAUSE;
                                    break;
                                default:
                                    // console.log('upload resolve default')
                                    result = UPLOAD_FAILED
                                    break;
                            }
                            // // console.log('result', result)
                        })
                        await handleTransRes
                        // // console.log("upload uploading return")
                        return result
                    } else if (data.stat === "finish") {
                        return UPLOAD_SUCCESS
                    } else if (data.stat === "waiting") {
                        let uploadPercent = parseInt(data.process)
                        return UPLOAD_WAITING
                    }
                } else if (data.ser_rsp === "no") {
                    // console.log('uploding 传输失败')
                    // errorinfo = "uploding 传输失败"
                    // this.setState({ errorinfo: errorinfo, visibleErrorModal: true })
                    return UPLOAD_FAILED
                }
            })
            .then((data) => {
                funRes = data
                // console.log(funRes)
            })
            .catch((error) => {
                // console.log(error)
                // errorinfo = "服务器下线了，嘤嘤嘤"
                // this.setState({ errorinfo: errorinfo, visibleErrorModal: true })
                funRes = UPLOAD_OFFLINE
            })
        //// console.log(UPLOAD_NORMAL)
        return funRes
    }

    async handleTrans(params, stat, chunk_send, fileIndex) {

        if(this.state.isPause){
            return TRANS_PAUSE
        }

        const { cookies } = this.props;
        const userid = cookies.get('userid')
        const iconvLite = require('iconv-lite');

        var errorinfo = this.state.errorinfo;
        var handleTransRes


        var _this_chunk_send = chunk_send
        var _this_stat = stat
        const _this_params = params

        var url = CONSTANT.Urls.transferUrl;
        // console.log(url)

        var funRes = TRANS_FAILED

        var loop = 1

        // console.log(_this_params)


        while (loop) {
            if(this.state.isPause){
                return TRANS_PAUSE
            }
            // // console.log(_this_chunk_send)
            // console.log(_this_stat)
            // let blob = new Blob([this.state.arrayFilesBufferData[chunk_send].currentBuffer], { type: 'application/octet-stream' })
            let blob = new Blob([this.state.arrayFilesBufferData[fileIndex][_this_chunk_send].currentBuffer], { type: 'application/octet-stream' })

            let trans_req = {
                cli_req: "trans",
                user_id: userid,
                parent_path: this.props.parentpath,
                name: _this_params.file.fileName,
                md5: _this_params.file.fileMd5,
                size: _this_params.chunks[_this_chunk_send].end - _this_params.chunks[_this_chunk_send].start,
                chunk_md5: _this_params.chunks[_this_chunk_send].chunkMd5,
                chunk: _this_chunk_send + 1       //server从1开始计数
            };

            // var body = iconvLite.encode(JSON.stringify(trans_req),'GBK').toString()
            // // console.log(body)

            let formData = new FormData();
            formData.append('JSON', JSON.stringify(trans_req))
            // formData.append('JSON', body)
            formData.append('chunk', blob)
            var whileRes;

            await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "text/plain",
                    'Accept': 'text/plain'
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
                mode: "cors",
                body: formData,
            }).then(res => res.json())
                .then((data) => {
                    // console.log(data)
                    if (data.ser_rsp === "ok") {
                        if (data.stat === "uploading") {
                            let uploadPercent = parseInt(data.process)
                            // this.state.uploadPercent = uploadPercent;
                            _this_chunk_send = data.chunk_send - 1
                            // console.log(_this_chunk_send)
                            _this_stat = data.stat
                            this.setState({
                                uploaded: false,    // 上传请求成功
                                currentChunks: _this_chunk_send,
                                uploadPercent: 100 * uploadPercent / params.chunks.length,
                                uploading: true
                            })
                            // console.log('transing')
                            return TRANS_UPLOADING
                        } else if (data.stat === "finish") {
                            _this_stat = data.stat
                            this.setState({
                                // uploaded: true,
                                // uploadRequest: false,    // 上传请求成功
                                uploadPercent: 100,
                                // uploading: false
                            })
                            // console.log('finish')
                            return TRANS_SUCCESS
                        } else if (data.stat === "waiting") {
                            _this_stat = data.stat
                            // console.log("waiting")
                            return TRANS_WAITING
                        }
                    }
                    else if (data.ser_rsp === "no") {
                        // errorinfo = "trans 传输失败"
                        // this.setState({ errorinfo: errorinfo, visibleErrorModal: true })
                        // console.log('no')
                        return TRANS_FAILED
                    }
                })
                .then((data) => {
                    whileRes = data
                    // console.log(whileRes)
                })
                .catch((error) => {
                    // console.log('trans err', error)
                    whileRes = TRANS_FAILED
                })
            switch (whileRes) {
                case TRANS_UPLOADING:
                    funRes = TRANS_UPLOADING
                    break;
                case TRANS_SUCCESS:
                    funRes = TRANS_SUCCESS
                    loop = 0
                    break;
                case TRANS_WAITING:
                    funRes = TRANS_WAITING
                    loop = 0
                    break;
                case TRANS_FAILED:
                    funRes = TRANS_FAILED
                    loop = 0
                    break;
                case TRANS_OFFLINE:
                    funRes = TRANS_FAILED
                    loop = 0
                    break;
                default:
                    // console.log('default')
                    funRes = TRANS_FAILED
                    loop = 0
                    break;
            }
        }
        return funRes
    }



    render() {
        const { preUploading, uploadPercent, preUploadPercent, uploadRequest, uploaded, uploading } = this.state
        var Reader = new FileReader()
        const _this = this

        const uploadPropFile = {
            name: 'file',
            // action: 'http://10.60.102.252:20020/file',
            onRemove: (file) => {
                // // console.log(this.state.fileList)
                this.setState(({ fileList, arrayUploadParams, arrayFilesBufferData, sthonFileList }) => {
                    const Index = fileList.indexOf(file)
                    const newFileList = fileList.slice()
                    const newarrayUploadParams = arrayUploadParams.slice()
                    const newarrayFilesBufferData = arrayFilesBufferData.slice()
                    var newSthonFileList = sthonFileList
                    newFileList.splice(Index, 1)
                    newarrayUploadParams.splice(Index, 1)
                    newarrayFilesBufferData.splice(Index, 1)
                    if (newarrayUploadParams.length === 0) {
                        newSthonFileList = false
                    }
                    return {
                        fileList: newFileList,
                        arrayUploadParams: newarrayUploadParams,
                        arrayFilesBufferData: newarrayFilesBufferData,
                        sthonFileList: newSthonFileList
                    }
                })
            },
            beforeUpload: (file) => {
                // console.log(file)
                // 首先清除一下各种上传的状态
                this.setState({
                    uploaded: false,   // 上传成功
                    uploading: false,  // 上传中
                    uploadRequest: false,   // 上传预处理
                    successNum: 0,
                    waitNum: 0,
                    arrayBufferData: [],
                    arrayFilesBufferData: [],
                    arrayUploadParams: [],
                    nowUploadingFile: -1,
                    uploadParams: {},
                    // fileList: [],
                    sthonFileList: false,
                    isPause: false
                })
                // 兼容性的处理
                let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                    chunks = Math.ceil(file.size / chunkSize),
                    currentChunk = 0, // 当前上传的chunk
                    spark = new SparkMD5.ArrayBuffer(),
                    // 对arrayBuffer数据进行md5加密，产生一个md5字符串
                    chunkFileReader = new FileReader(),  // 用于计算出每个chunkMd5
                    totalFileReader = new FileReader()  // 用于计算出总文件的fileMd5

                let params = { chunks: [], file: {} },   // 用于上传所有分片的md5信息
                    arrayBufferData = []              // 用于存储每个chunk的arrayBuffer对象,用于分片上传使用
                params.file.fileName = file.name
                params.file.fileSize = file.size
                // console.log(file.size)
                params.file.stat = FILE_STAT_IDLE

                totalFileReader.readAsArrayBuffer(file)
                totalFileReader.onload = function (e) {
                    // 对整个totalFile生成md5
                    spark.append(e.target.result)
                    if (file.size === 0) {
                        // console.log('recognize 0')
                        params.file.fileMd5 = "0"
                    } else {
                        params.file.fileMd5 = spark.end() // 计算整个文件的fileMd5
                    }
                }

                chunkFileReader.onload = function (e) {
                    // 对每一片分片进行md5加密
                    spark.append(e.target.result)
                    // 每一个分片需要包含的信息
                    let obj = {
                        chunk: currentChunk + 1,
                        start: currentChunk * chunkSize, // 计算分片的起始位置
                        end: ((currentChunk * chunkSize + chunkSize) >= file.size) ? file.size : currentChunk * chunkSize + chunkSize, // 计算分片的结束位置
                        chunkMd5: spark.end(),
                        chunks
                    }
                    // 每一次分片onload,currentChunk都需要增加，以便来计算分片的次数
                    currentChunk++;
                    params.chunks.push(obj)

                    // 将每一块分片的arrayBuffer存储起来，用来partUpload
                    let tmp = {
                        chunk: obj.chunk,
                        currentBuffer: e.target.result
                    }
                    arrayBufferData.push(tmp)

                    if (currentChunk < chunks) {
                        // 当前切片总数没有达到总数时
                        loadNext()

                        // 计算预处理进度
                        _this.setState({
                            preUploading: true,
                            preUploadPercent: Number((currentChunk / chunks * 100).toFixed(2))
                        })
                    } else {
                        //记录所有chunks的长度
                        params.file.fileChunks = params.chunks.length
                        // 表示预处理结束，将上传的参数，arrayBuffer的数据存储起来
                        _this.state.arrayUploadParams.push(params)
                        _this.state.arrayFilesBufferData.push(arrayBufferData)
                        _this.setState({
                            preUploading: false,
                            uploadParams: params,
                            arrayBufferData,
                            chunksSize: chunks,
                            preUploadPercent: 100,
                            sthonFileList: true,
                        })
                    }
                }

                totalFileReader.onerror = function () {
                    console.warn('oops, something went wrong.');
                };

                function loadNext() {
                    var start = currentChunk * chunkSize,
                        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                    chunkFileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                }

                loadNext()

                this.state.fileList.push(file)
                this.setState({
                    // fileList: [file],
                    file: file
                })
                return false
            },
            fileList: this.state.fileList,
            multiple: true
        }

        return (
            <div className="content">
                <Spin tip={
                    <div >
                        <h3 style={{ margin: '10px auto', color: '#1890ff' }}>文件预处理中...</h3>
                        <Progress width={80} percent={preUploadPercent} type="circle" status="active" />
                    </div>
                }
                    spinning={preUploading}
                    style={{ height: 150 }}>
                    <Row> <Col sm={{ size: 1, offset: 10 }}>
                        <Button className="btn-simple" color="danger" onClick={this.handlePause} disabled={(uploading && !this.state.isPause) ? false : true} size="sm">
                            <Icon type="pause" />暂停
                        </Button></Col>
                        <Col sm={{ size: 1, offset: 10 }}>
                            <Button className="btn-simple" color="primary" onClick={this.handleContinue} disabled={(uploading &&this.state.isPause) ? false : true} size="sm">
                                <Icon type="right" />继续
                        </Button>
                        </Col>
                    </Row>
                    <div style={{ marginTop: 16, height: "50%" }}>

                        <Upload {...uploadPropFile}>
                            {/* <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">点击或者拖拽文件进行上传</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p> */}
                            <Button className="btn-simple" color="info">
                                <Icon type="upload" /> Upload File
                            </Button>
                        </Upload>
                        {uploadPercent >= 0 && !!uploading && <div style={{ marginTop: 20, width: '95%' }}>
                            <Progress percent={uploadPercent} status="active" />
                            <div>{this.state.successNum + '/' + this.state.arrayUploadParams.length}</div>
                            <h4>文件上传中，请勿关闭窗口</h4>
                        </div>}
                        {!!uploadRequest && <h4 style={{ color: '#1890ff' }}>上传请求中...</h4>}
                        {uploaded && <h4 style={{ color: '#52c41a' }}>文件上传成功</h4>}
                        <Button className="btn-simple" color="info" onClick={this.toggleConfirmModal} disabled={this.state.sthonFileList ? false : true}>
                            <Icon type="upload" />提交上传
                        </Button>
                    </div>
                </Spin>
                <Modal isOpen={this.state.visibleConfirmModal} centered={true} >
                    <ModalHeader toggle={this.toggleConfirmModal} >
                        <div style={{ fontSize: "24px" }}>上传文件确认</div>
                        <div style={{ fontSize: "18px" }}>Confirm</div>
                    </ModalHeader>
                    <ModalBody>
                        <div style={{ fontSize: "18px" }}>
                            确定上传这些文件吗，现在还有机会反悔哦
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-simple" color="primary" onClick={this.controlUpload}>
                            <div style={{ fontSize: "18px" }}>Confirm</div></Button>
                        <Button className="btn-simple" color="info" onClick={this.toggleConfirmModal}>
                            <div style={{ fontSize: "18px" }}>Cancle</div></Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.visibleErrorModal} centered={true} id="ErrorInfo">
                    <ModalHeader toggle={this.toggleErrorModal} >
                        <div style={{ fontSize: "24px" }}>文件传输错误 </div>
                        <div style={{ fontSize: "18px" }}>Error</div>
                    </ModalHeader>
                    <ModalBody>
                        <div style={{ fontSize: "18px" }}>
                            {this.state.errorinfo}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-simple" color="info" onClick={this.toggleErrorModal}><div style={{ fontSize: "18px" }}>OK</div></Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.visibleSuccessModal} centered={true} id="ErrorInfo">
                    <ModalHeader toggle={this.toggleSuccessModal} >
                        <div style={{ fontSize: "24px" }}>文件传输成功 </div>
                        <div style={{ fontSize: "18px" }}>Success</div>
                    </ModalHeader>
                    <ModalBody>
                        <div style={{ fontSize: "18px" }}>
                            {this.state.successinfo}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="btn-simple" color="info" onClick={this.toggleSuccessModal}><div style={{ fontSize: "18px" }}>OK</div></Button>
                    </ModalFooter>
                </Modal>
                {/* <Dragger multiple={true}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                    </p>
                </Dragger> */}
            </div >
        )
    }
}

FileUpload.propTypes = {
    //...
}

export default withCookies(FileUpload)