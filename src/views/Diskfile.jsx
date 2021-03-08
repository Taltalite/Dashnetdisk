/*!

=========================================================
* Black Dashboard React v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// react-fine-uploader
import FineUploaderTraditional from 'fine-uploader-wrappers'

import { connect } from "react-redux";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { getUsername } from "../redux/selectors";

import '../assets/css/gallery.css'

import FileUpload from '../components/upload/FileUpload'
import DirUpload from '../components/upload/DirUpload'
import FileTable from '../components/file/filetable'

import FileImg from '../assets/img/file.png';
import FolderImg from '../assets/img/folder.png';

import CONSTANT from '../variables/CONSTANT';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip
} from "reactstrap";

import { Avatar, Table, List, Tag, Icon, Button as AntdButton } from 'antd';

const uploader = new FineUploaderTraditional({
  options: {
    chunking: {
      enabled: true
    },
    deleteFile: {
      enabled: true,
      endpoint: '/uploads'
    },
    request: {
      endpoint: '/uploads'
    },
    retry: {
      enableAuto: true
    }
  }
})

class Dashboard extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      bigChartData: "data1",
      parentpath: "/",
      data: [
        // {
        //   key: '1',
        //   filename: 'John Brown1111111111',
        //   filetype: 'file',
        //   size: 50,
        //   tags: ['nice', 'developer'],
        // },
        // {
        //   key: '2',
        //   filename: 'Jim Green',
        //   filetype: 'file',
        //   size: 60000,
        //   tags: ['loser'],
        // },
        // {
        //   key: '3',
        //   filename: 'Joe Black',
        //   filetype: 'dir',
        //   size: 0,
        //   tags: ['cool', 'teacher'],
        // }
      ],
      filenum: 0,
      visibleNewFolderModal: false,
      visibleRenameModal: false,
      visibleErrorModal: false,
      visibleFileUploadModal: false,
      visibleDirUploadModal: false,
      tooltipPasteHere: false,
      uploadDir: false,
      clipboard: {
        sthonClipBoard: false,
        coping: false,
        moving: false,
        clipFilePath: "",
        clipFileName: "",
        clipFileType: "",
      },
      newFolderName: "",
      oldFileName: "",
      newFileName: "",
      errorinfo: ""
    };

    this.toggleNewFolderModal = this.toggleNewFolderModal.bind(this);
    this.toggleRenameModal = this.toggleRenameModal.bind(this);
    this.togglePasteHere = this.togglePasteHere.bind(this);
    this.toggleFileUploadModal = this.toggleFileUploadModal.bind(this);
    this.toggleDirUploadModal = this.toggleDirUploadModal.bind(this);
    this.openRenameModal = this.openRenameModal.bind(this);
    this.toggleErrorModal = this.toggleErrorModal.bind(this);
    this.handleInputNewFolderName = this.handleInputNewFolderName.bind(this);
    this.handleCreateDir = this.handleCreateDir.bind(this);
    this.backToParent = this.backToParent.bind(this);
    this.handleClickName = this.handleClickName.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.handleInputNewFileName = this.handleInputNewFileName.bind(this);
    this.clearClipBoard = this.clearClipBoard.bind(this);
    this.toogleUploadModalErr = this.toogleUploadModalErr.bind(this);
    this.handleDirUpload = this.handleDirUpload.bind(this);
    this.handleFileDownload = this.handleFileDownload.bind(this);

  }

  componentDidMount() {
    const { cookies } = this.props;
    this.state.parentpath = cookies.get('parentpath')
    // console.log(cookies.get('userid'))
    // console.log(this.props)
    this.fetchFileList(this.state.parentpath);
  }

  handleFileClick() {
    // console.log('click');
  };

  handleClickName = (dirname) => {
    const { cookies } = this.props;
    // var dirname = '123'
    var parentpath = this.state.parentpath
    var newparentpath = parentpath + dirname + '/'
    // console.log('click')
    this.fetchFileList(newparentpath)
    cookies.set('parentpath', newparentpath, { path: '/' })   //cookie
    this.setState({ parentpath: newparentpath })
  }

  handleDirUpload() {
    this.setState({
      uploadDir: true
    })
    this.toggleNewFolderModal()
    // this.toggleDirUploadModal()
  }

  handleInputNewFolderName(event) {
    this.setState({
      newFolderName: event.target.value
    })
  }
  handleInputNewFileName(event) {
    this.setState({
      newFileName: event.target.value
    })
  }

  toggleNewFolderModal() {
    var visibleNewFolderModal = this.state.visibleNewFolderModal;
    this.setState({
      visibleNewFolderModal: !visibleNewFolderModal, newFolderName: ""
    })
  }

  toggleFileUploadModal() {
    var visibleFileUploadModal = this.state.visibleFileUploadModal;
    this.fetchFileList(this.state.parentpath)
    this.setState({
      visibleFileUploadModal: !visibleFileUploadModal
    })
  }

  toggleDirUploadModal() {
    var visibleDirUploadModal = this.state.visibleDirUploadModal;
    this.fetchFileList(this.state.parentpath)
    this.setState({
      visibleDirUploadModal: !visibleDirUploadModal, uploadDir: false
    })
  }

  togglePasteHere() {
    var tooltipPasteHere = this.state.tooltipPasteHere;
    this.setState({
      tooltipPasteHere: !tooltipPasteHere
    })
  }

  openRenameModal(oldname) {
    var visibleRenameModal = this.state.visibleRenameModal;
    this.setState({
      visibleRenameModal: !visibleRenameModal, newFileName: "", oldFileName: oldname
    })
  }

  toggleRenameModal() {
    var visibleRenameModal = this.state.visibleRenameModal;
    this.setState({
      visibleRenameModal: !visibleRenameModal, newFileName: ""
    })
  }

  toogleUploadModalErr() {
    var errorinfo = "请先登录"
    this.setState({
      visibleErrorModal: true, errorinfo: errorinfo
    })
  }

  toggleErrorModal() {
    var visibleErrorModal = this.state.visibleErrorModal;
    this.setState({
      visibleErrorModal: !visibleErrorModal, errorinfo: ""
    })
  }

  backToParent() {
    const { cookies } = this.props;
    var parentpath = this.state.parentpath
    var dirs = parentpath.split("/")
    var newparentpath = ""
    for (var i = 0; i < dirs.length - 2; i++) {
      newparentpath = newparentpath + dirs[i] + '/'
    }
    this.fetchFileList(newparentpath)
    cookies.set('parentpath', newparentpath, { path: '/' })   //cookie
    this.setState({ parentpath: newparentpath })
  }

  clearClipBoard() {
    const clipboard = {
      sthonClipBoard: false,
      coping: false,
      moving: false,
      clipFilePath: "",
      clipFileName: "",
      clipFileType: "",
    }
    this.state.clipboard = clipboard
    this.setState({})
  }

  addCut(filename, filetype) {
    // console.log('addCut')
    const parentpath = this.state.parentpath
    var clipboard = {
      sthonClipBoard: true,
      coping: false,
      moving: true,
      clipFilePath: parentpath,
      clipFileName: filename,
      clipFileType: filetype,
    }
    this.state.clipboard = clipboard
    this.setState({})
  }

  addCopy(filename, filetype) {
    // console.log('addCopy')
    const parentpath = this.state.parentpath
    const clipboard = {
      sthonClipBoard: true,
      coping: true,
      moving: false,
      clipFilePath: parentpath,
      clipFileName: filename,
      clipFileType: filetype,
    }
    this.state.clipboard = clipboard
    this.setState({})
  }

  pasteHere(new_parent_path) {
    const { cookies } = this.props;
    // console.log('pasteHere')
    const parentpath = this.state.parentpath;
    const userid = cookies.get('userid')
    var url = CONSTANT.Urls.filelistUrl;
    // console.log(url);

    var errorinfo = this.state.errorinfo;
    var visibleErrorModal = this.state.visibleErrorModal;

    const clipboard = this.state.clipboard;

    var filedata = [];
    var filenum = this.state.filenum;
    filenum = 0;

    // // console.log(clipboard);

    if (clipboard.moving) {    //Cut
      if (clipboard.clipFileType === 'dir') {
        var pre_dirs = clipboard.clipFilePath.split("/")
        var new_dirs = new_parent_path.split("/")
        if (new_dirs.length >= pre_dirs.length) {
          var i;
          for (i = 0; i < pre_dirs.length - 1; i++) {
            if (new_dirs[i] === pre_dirs[i]) {
              continue;
            } else {
              break;
            }
          }
          if (i === pre_dirs.length - 1) {
            errorinfo = "无效操作"
            // console.log("无效操作")
            this.setState({ errorinfo: errorinfo, visibleErrorModal: true })
            return
          }
        }
      }
      // console.log('cut')
      let req_list = {
        cli_req: "move",
        user_id: userid,
        type: clipboard.clipFileType,
        pre_parent_path: clipboard.clipFilePath,
        new_parent_path: new_parent_path,
        pre_name: clipboard.clipFileName,
        new_name: clipboard.clipFileName
      };
      fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "text/plain",
          'Accept': 'text/plain'
        },
        body: JSON.stringify(req_list),
      }).then(res => res.json())
        .then((data) => {
          if (data.ser_rsp === "ok") {
            if (typeof (data.contents) == 'undefined') {
              // console.log('data.contents undefined')
            } else {
              this.fetchFileList(parentpath)
              this.clearClipBoard()
              this.setState({ data: filedata, filenum: filenum })
            }
          } else if (data.ser_rsp === "no") {
            if (data.err_rsn === "no-exist pre_parent_path") {
              errorinfo = "源目录不存在"
            } else if (data.err_rsn === "no-exist new_parent_path") {
              errorinfo = "目标目录不存在"
              if (this.state.parentpath !== '/') {
                this.backToParent()
              }
            } else if (data.err_rsn === "no-exist file/dir") {
              errorinfo = "源文件已被删除"
              this.clearClipBoard()
            } else if (data.err_rsn === "existed filename/dirname") {
              errorinfo = "目标文件夹已有该名"
            } else if (data.err_rsn === "move to subdir") {
              errorinfo = "目标文件夹为子文件夹"
            } else {
              errorinfo = "未知错误"
            }
            visibleErrorModal = true
            this.setState({ errorinfo: errorinfo, visibleErrorModal: visibleErrorModal })
          }
        })
        .catch((error) => {
          // console.log('request failed', error)
          errorinfo = "服务器下线啦，嘤嘤嘤"
          this.setState({ visibleErrorModal: true, errorinfo: errorinfo })
        })

    } else if (clipboard.coping) {  //Copy
      // console.log('copy')
      let req_list = {
        cli_req: "copy",
        user_id: userid,
        type: clipboard.clipFileType,
        pre_parent_path: clipboard.clipFilePath,
        new_parent_path: new_parent_path,
        pre_name: clipboard.clipFileName,
        new_name: clipboard.clipFileName
      };
      fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "text/plain",
          'Accept': 'text/plain'
        },
        body: JSON.stringify(req_list),
      }).then(res => res.json())
        .then((data) => {
          if (data.ser_rsp === "ok") {
            if (typeof (data.contents) == 'undefined') {
              // console.log('data.contents undefined')
            } else {
              this.fetchFileList(parentpath)
              this.clearClipBoard()
              this.setState({ data: filedata, filenum: filenum })
            }
          } else if (data.ser_rsp === "no") {
            if (data.err_rsn === "no-exist pre_parent_path") {
              errorinfo = "源目录不存在"
            } else if (data.err_rsn === "no-exist new_parent_path") {
              errorinfo = "目标目录不存在"
              if (this.state.parentpath !== '/') {
                this.backToParent()
              }
            } else if (data.err_rsn === "no-exist file/dir") {
              errorinfo = "源文件已被删除"
              this.clearClipBoard()
            } else if (data.err_rsn === "existed filename/dirname") {
              errorinfo = "目标文件夹已有该名"
            } else {
              errorinfo = "未知错误"
            }
            visibleErrorModal = true
            this.setState({ errorinfo: errorinfo, visibleErrorModal: visibleErrorModal })
          }
        })
        .catch((error) => {
          // console.log('request failed', error)
          errorinfo = "服务器下线啦，嘤嘤嘤"
          this.setState({ visibleErrorModal: true, errorinfo: errorinfo })
        })
    }


  }

  fetchFileList(parentpath) {
    // console.log('fetchFileList')
    // console.log(parentpath)
    // console.log(this.state.parentpath)
    const { cookies } = this.props;
    var url = CONSTANT.Urls.filelistUrl;
    const userid = cookies.get('userid')
    // console.log(url);
    const iconvLite = require('iconv-lite');

    var errorinfo = this.state.errorinfo;
    var visibleErrorModal = this.state.visibleErrorModal;

    var filedata = [];
    var filenum = this.state.filenum;
    filenum = 0;

    let req_list = {
      cli_req: "refresh",
      user_id: userid,
      parent_path: parentpath
    };
    // var body = iconvLite.encode(JSON.stringify(req_list),'gbk')

    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain",
        'Accept': 'text/plain'
      },
      body: JSON.stringify(req_list),
      // body: body,
    }).then((res) => {
      return res.json()
    })
      .then((data) => {
        // console.log(data)
        // var thisdata = iconvLite.decode(data,'gbk');
        // // console.log(thisdata)
        if (data.ser_rsp === "ok") {
          if (typeof (data.contents) == 'undefined') {
            // console.log('data.contents undefined')
          } else {
            for (var i = 0; i < data.contents.length; i++) {
              filenum++;
              var filesize = typeof (data.contents[i].size) == 'undefined' ? 0 : data.contents[i].size;
              let singlefile = {
                key: String(filenum),
                filename: data.contents[i].name,
                filetype: data.contents[i].type,
                size: filesize,
                tags: ['奥利给', '干就完了'],
              }
              filedata.push(singlefile);
            }
            this.setState({ data: filedata, filenum: filenum })
          }
        } else if (data.ser_rsp === "no") {
          if (data.err_rsn === "no-exist dir") {
            errorinfo = "该目录已经被删除"
          } else {
            errorinfo = "未知错误"
          }
          visibleErrorModal = true
          this.setState({ errorinfo: errorinfo, visibleErrorModal: visibleErrorModal })
        }
      })
      .catch((error) => {
        // console.log('request failed', error)
        errorinfo = "服务器下线啦，嘤嘤嘤"
        this.setState({ visibleErrorModal: true, errorinfo: errorinfo })
      })
  }

  handleFileDownload(filename) {
    const { cookies } = this.props;
    // console.log('download')
    const parentpath = this.state.parentpath;
    const userid = cookies.get('userid')
    const url = CONSTANT.Urls.downloadUrl;
    // console.log(url)
    var downloadUrl;
    const oa = document.createElement('a');

    var errorinfo

    let req_list = {
      cli_req: "download",
      user_id: userid,
      type: 'file',
      parent_path: parentpath,
      name: filename
    };

    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain",
        'Accept': 'text/plain'
      },
      body: JSON.stringify(req_list),
    }).then(res => res.json())
      .then((data) => {
        if (data.ser_rsp === "ok") {
          downloadUrl = data.url;
          // console.log(downloadUrl)
          oa.href = downloadUrl;
          oa.setAttribute("download",filename);
          // oa.download = ""
          // console.log(oa)
          document.body.appendChild(oa);
          oa.click();
        } else if (data.ser_rsp === "no") {
          if (data.err_rsn === "no-exist parent_path") {
            errorinfo = "该路径不存在"
          } else if (data.err_rsn === "no-exist filename") {
            errorinfo = "该文件不存在"
          } else {
            errorinfo = "未知错误"
          }
          this.setState({ errorinfo: errorinfo, visibleErrorModal: true })
        }
      })
  }

  handleDelete(filetype, filename) {
    const { cookies } = this.props;
    // console.log('delete')
    const parentpath = this.state.parentpath;
    const userid = cookies.get('userid')
    var url = CONSTANT.Urls.filelistUrl;
    // console.log(url);

    var errorinfo = this.state.errorinfo;
    var visibleErrorModal = this.state.visibleErrorModal;

    var filedata = [];
    var filenum = this.state.filenum;
    filenum = 0;

    let req_list = {
      cli_req: "delete",
      user_id: userid,
      type: filetype,
      parent_path: parentpath,
      name: filename
    };
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain",
        'Accept': 'text/plain'
      },
      body: JSON.stringify(req_list),
    }).then(res => res.json())
      .then((data) => {
        if (data.ser_rsp === "ok") {
          if (typeof (data.contents) == 'undefined') {
            // console.log('data.contents undefined')
          } else {
            for (var i = 0; i < data.contents.length; i++) {
              filenum++;
              var filesize = typeof (data.contents[i].size) == 'undefined' ? 0 : data.contents[i].size;
              let singlefile = {
                key: String(filenum),
                filename: data.contents[i].name,
                filetype: data.contents[i].type,
                size: filesize,
                tags: ['奥利给', '干就完了'],
              }
              filedata.push(singlefile);
            }
            this.setState({ data: filedata, filenum: filenum })
          }
        } else if (data.ser_rsp === "no") {
          if (data.err_rsn === "no-exist parent_path") {
            errorinfo = "该路径不存在"
          } else if (data.err_rsn === "no-exist file/dir") {
            errorinfo = "该文件/文件夹不存在"
            for (var i = 0; i < data.contents.length; i++) {
              filenum++;
              var filesize = typeof (data.contents[i].size) == 'undefined' ? 0 : data.contents[i].size;
              let singlefile = {
                key: String(filenum),
                filename: data.contents[i].name,
                filetype: data.contents[i].type,
                size: filesize,
                tags: ['奥利给', '干就完了'],
              }
              filedata.push(singlefile);
            }
            this.setState({ data: filedata, filenum: filenum })
          } else {
            errorinfo = "未知错误"
          }
          visibleErrorModal = true
          this.setState({ errorinfo: errorinfo, visibleErrorModal: visibleErrorModal })
        }
      })
      .catch((error) => {
        // console.log('request failed', error)
        errorinfo = "服务器下线啦，嘤嘤嘤"
        this.setState({ visibleErrorModal: true, errorinfo: errorinfo })
      })
  }

  handleCreateDir() {
    const { cookies } = this.props;
    // console.log('create dir')
    const newFolderName = this.state.newFolderName
    const parentpath = this.state.parentpath;
    const userid = cookies.get('userid')
    var url = CONSTANT.Urls.filelistUrl;
    // console.log(url);

    var errorinfo = this.state.errorinfo;
    var visibleErrorModal = this.state.visibleErrorModal;

    var filedata = [];
    var filenum = this.state.filenum;
    filenum = 0;

    let req_list = {
      cli_req: "create",
      user_id: userid,
      parent_path: parentpath,
      name: newFolderName
    };

    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain",
        'Accept': 'text/plain'
      },
      body: JSON.stringify(req_list),
    }).then(res => res.json())
      .then((data) => {
        if (data.ser_rsp === "ok") {
          if (typeof (data.contents) == 'undefined') {
            // console.log('data.contents undefined')
          } else {
            for (var i = 0; i < data.contents.length; i++) {
              filenum++;
              var filesize = typeof (data.contents[i].size) == 'undefined' ? 0 : data.contents[i].size;
              let singlefile = {
                key: String(filenum),
                filename: data.contents[i].name,
                filetype: data.contents[i].type,
                size: filesize,
                tags: ['奥利给', '干就完了'],
              }
              filedata.push(singlefile);
            }
            this.toggleNewFolderModal()
            this.setState({ data: filedata, filenum: filenum, parentpath: parentpath + newFolderName + '/' })
            // this.fetchFileList(parentpath+newFolderName+'/')
            // console.log(parentpath+newFolderName+'/')
            if (this.state.uploadDir === true) {
              this.toggleDirUploadModal()
            } else {
              // console.log(parentpath+newFolderName+'/')
              this.fetchFileList(parentpath+newFolderName+'/')
            }
          }
        } else if (data.ser_rsp === "no") {
          if (data.err_rsn === "existed dirname") {
            errorinfo = "该目录名已经存在"
          } else {
            errorinfo = "未知错误"
          }
          visibleErrorModal = true
          this.setState({ errorinfo: errorinfo, visibleErrorModal: visibleErrorModal })
        }
      })
      .catch((error) => {
        // console.log('request failed', error)
        errorinfo = "服务器下线啦，嘤嘤嘤"
        this.setState({ visibleErrorModal: true, errorinfo: errorinfo })
      })
  }

  handleRename() {
    const { cookies } = this.props;
    // console.log('create dir')
    const parentpath = this.state.parentpath;
    const oldname = this.state.oldFileName;
    const newname = this.state.newFileName
    const userid = cookies.get('userid')
    var url = CONSTANT.Urls.filelistUrl;
    // console.log(url);

    var errorinfo = this.state.errorinfo;
    var visibleErrorModal = this.state.visibleErrorModal;

    var filedata = [];
    var filenum = this.state.filenum;
    filenum = 0;

    let req_list = {
      cli_req: "rename",
      user_id: userid,
      parent_path: parentpath,
      pre_name: oldname,
      new_name: newname
    };

    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain",
        'Accept': 'text/plain'
      },
      body: JSON.stringify(req_list),
    }).then(res => res.json())
      .then((data) => {
        if (data.ser_rsp === "ok") {
          if (typeof (data.contents) == 'undefined') {
            // console.log('data.contents undefined')
          } else {
            for (var i = 0; i < data.contents.length; i++) {
              filenum++;
              var filesize = typeof (data.contents[i].size) == 'undefined' ? 0 : data.contents[i].size;
              let singlefile = {
                key: String(filenum),
                filename: data.contents[i].name,
                filetype: data.contents[i].type,
                size: filesize,
                tags: ['奥利给', '干就完了'],
              }
              filedata.push(singlefile);
            }
            this.toggleRenameModal()
            this.setState({ data: filedata, filenum: filenum })
          }
        } else if (data.ser_rsp === "no") {
          if (data.err_rsn === "no-exist file") {
            errorinfo = "该文件不存在"
            for (var i = 0; i < data.contents.length; i++) {
              filenum++;
              var filesize = typeof (data.contents[i].size) == 'undefined' ? 0 : data.contents[i].size;
              let singlefile = {
                key: String(filenum),
                filename: data.contents[i].name,
                filetype: data.contents[i].type,
                size: filesize,
                tags: ['奥利给', '干就完了'],
              }
              filedata.push(singlefile);
            }
            this.setState({ data: filedata, filenum: filenum })
          } else if (data.err_rsn === "existed filename") {
            errorinfo = "文件名已经存在"
          } else {
            errorinfo = "未知错误"
          }
          visibleErrorModal = true
          this.setState({ errorinfo: errorinfo, visibleErrorModal: visibleErrorModal })
        }
      })
      .catch((error) => {
        // console.log('request failed', error)
        errorinfo = "服务器下线啦，嘤嘤嘤"
        this.setState({ visibleErrorModal: true, errorinfo: errorinfo })
      })
  }

  render() {

    const { cookies } = this.props;
    const login = cookies.get('login')

    const columns = [
      {
        title: '文件名称',
        dataIndex: 'filename',
        key: 'filename',
        width: 700,
        render: (text, record) => (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <Avatar src={record.filetype === 'file' ? FileImg : FolderImg} />
            <a style={{ fontSize: 20, color: "#66CCFF" }}
              hidden={record.filetype === 'file' ? false : true}>{text}</a>
            <a style={{ fontSize: 20, color: "#66CCFF" }} href="javascript:void(0)" onClick={this.handleClickName.bind(this, text)}
              hidden={record.filetype === 'dir' ? false : true}>{text}</a>
          </div>
        ),
      },
      {
        title: '文件类型',
        dataIndex: 'filetype',
        key: 'filetype',
        width: 100,
        render: (text) => (
          <span>
            <a style={{ fontSize: 20, color: "#FFCC99" }}>{text}</a>
          </span>
        ),
      },
      {
        title: '文件大小',
        dataIndex: 'size',
        key: 'size',
        width: 150,
        render: (text, record) => (
          <span>
            <a style={{ fontSize: 20, color: "#FF99CC" }} >{(record.filetype === 'file') ? text : '---'}</a>
          </span>
        ),
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 550,
        render: (text, record) => (
          <span>
            <Button className="btn-simple" color="primary" size="sm" disabled={record.filetype === 'file' ? false : true}
              onClick={this.handleFileDownload.bind(this, record.filename)}>下载</Button>
            <Button className="btn-simple" color="danger" size="sm" disabled={false}
              onClick={this.handleDelete.bind(this, record.filetype, record.filename)}>删除</Button>
            <Button className="btn-simple" color="info" size="sm" disabled={false}
              onClick={this.addCut.bind(this, record.filename, record.filetype)}>剪切</Button>
            <Button className="btn-simple" color="info" size="sm" disabled={false}
              onClick={this.addCopy.bind(this, record.filename, record.filetype)}>复制</Button>
            <Button className="btn-simple" color="info" size="sm" disabled={record.filetype === 'file' ? false : true}
              onClick={this.openRenameModal.bind(this, record.filename)}>改名</Button>
          </span>
        ),
      },
    ];


    return (
      <div className="content">
        <Row>
          <Col sm={{ size: 'auto' }}>
            <Button className="btn-simple" color="warning" size="lg"
              disabled={false}
              onClick={login === 'yes' ? this.toggleFileUploadModal : this.toogleUploadModalErr}>
              <div style={{ fontSize: "18px" }}>
                上传文件
              </div>
            </Button>
          </Col>
          <Col sm={{ size: 'auto' }}>
            <Button className="btn-simple" color="warning" size="lg"
              disabled={false}
              onClick={login === 'yes' ? this.handleDirUpload : this.toogleUploadModalErr}>
              <div style={{ fontSize: "18px" }}>
                上传文件夹
                </div>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col >
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: 32 }}>文件列表 File List</CardTitle>
                <CardTitle style={{ fontSize: 18 }}>当前路径： {this.state.parentpath}</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Button className="btn-simple" color="danger" size="sm"
                    disabled={this.state.parentpath === '/' ? true : false}
                    onClick={this.backToParent} icon="download">
                    <Icon type="left"/> Back</Button>
                  <Button className="btn-simple" color="warning" size="sm"
                    onClick={this.toggleNewFolderModal}>
                    Create Dir</Button>
                  <Button className="btn-simple" color="warning" size="sm" id="PasteHere"
                    disabled={this.state.clipboard.sthonClipBoard ? false : true} onClick={this.pasteHere.bind(this, this.state.parentpath)}>
                    Paste Here</Button>
                  {/* <Button className="btn-simple" color="warning" size="sm"
                    disabled={true} onClick={this.clearClipBoard}>
                    Clear Clip Board</Button> */}
                  <Button className="btn-simple" color="success" size="sm"
                    disabled={false} onClick={this.fetchFileList.bind(this, this.state.parentpath)}>
                    Refresh</Button>
                </Row>
                <Table columns={columns} dataSource={this.state.data} pagination={false} />
                {/* <FileTable /> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.visibleFileUploadModal} centered={true} style={{ width: "1000px", height: "900px" }} size="lg">
          <ModalHeader toggle={this.toggleFileUploadModal} >
            <div style={{ fontSize: "24px" }}>上传文件</div>
            <div style={{ fontSize: "18px" }}>Upload File(s)</div>
          </ModalHeader>
          <ModalBody>
            <FileUpload parentpath={this.state.parentpath} />
          </ModalBody>
          <ModalFooter>
            <Button className="btn-simple" color="info" onClick={this.toggleFileUploadModal}>
              <div style={{ fontSize: "18px" }}>Quit</div></Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.visibleDirUploadModal} centered={true} style={{ width: "1000px", height: "900px" }} size="lg">
          <ModalHeader toggle={this.toggleDirUploadModal} >
            <div style={{ fontSize: "24px" }}>上传文件夹</div>
            <div style={{ fontSize: "18px" }}>Upload Dir</div>
          </ModalHeader>
          <ModalBody>
            <DirUpload parentpath={this.state.parentpath} />
          </ModalBody>
          <ModalFooter>
            <Button className="btn-simple" color="info" onClick={this.toggleDirUploadModal}>
              <div style={{ fontSize: "18px" }}>Quit</div></Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.visibleNewFolderModal} centered={true}>
          <ModalHeader toggle={this.toggleNewFolderModal} >
            <div style={{ fontSize: "24px" }}>新建目录 </div>
            <div style={{ fontSize: "18px" }}>Create New dir </div>
          </ModalHeader>
          <ModalBody>
            <Input
              // defaultValue="继续交易"
              placeholder="不能为空"
              type="text"
              key="newfoldername"
              name="newfoldername"
              onChange={this.handleInputNewFolderName}
              style={{
                fontSize: "16px",
                textAlign: "left"
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button className="btn-simple" color="primary" onClick={this.handleCreateDir} disabled={this.state.newFolderName === "" ? true : false}>
              <div style={{ fontSize: "18px" }}>Create</div></Button>
            <Button className="btn-simple" color="info" onClick={this.toggleNewFolderModal}>
              <div style={{ fontSize: "18px" }}>Cancel</div></Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.visibleRenameModal} centered={true}>
          <ModalHeader toggle={this.toggleRenameModal} >
            <div style={{ fontSize: "24px" }}>文件重命名 </div>
            <div style={{ fontSize: "18px" }}>File Rename </div>
          </ModalHeader>
          <ModalBody>
            <Input
              // defaultValue="继续交易"
              placeholder="不能为空"
              type="text"
              key="newfoldername"
              name="newfoldername"
              onChange={this.handleInputNewFileName}
              style={{
                fontSize: "16px",
                textAlign: "left"
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button className="btn-simple" color="primary" onClick={this.handleRename} disabled={this.state.newFileName === "" ? true : false}>
              <div style={{ fontSize: "18px" }}>Confirm</div></Button>
            <Button className="btn-simple" color="info" onClick={this.toggleRenameModal}>
              <div style={{ fontSize: "18px" }}>Cancel</div></Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.visibleErrorModal} centered={true} id="ErrorInfo">
          <ModalHeader toggle={this.toggleErrorModal} >
            <div style={{ fontSize: "24px" }}>错误 </div>
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
        <Tooltip placement="top" isOpen={this.state.tooltipPasteHere} target="PasteHere" toggle={this.togglePasteHere}>
          <div style={{ fontSize: "16px", textAlign: "left", width: "500px" }}>
            {'文件名: ' + this.state.clipboard.clipFileName}<br />
            {'源: ' + this.state.clipboard.clipFilePath}<br />
            {'类型: ' + this.state.clipboard.clipFileType}<br />
          </div>
        </Tooltip>
        {/* <FileTable /> */}
        {/* <Table columns={columns} dataSource={this.state.data} /> */}
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return ({
//     username: getUsername(state)
//     // username: "111"
//   })
// }

// export default connect(mapStateToProps)(Dashboard);

export default withCookies(Dashboard)
