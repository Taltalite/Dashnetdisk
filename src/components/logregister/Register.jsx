import React from 'react';

import { Icon } from 'antd';
import { Redirect } from "react-router-dom";

import CONSTANT from '../../variables/CONSTANT';

// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

//ls ===5 表示验证通过
function isSimplePwd(s) {
  if (s.length < 8) {
    return 0;
  }
  var ls = 0;
  if (s.length >= 8) {    //长度
    ls++;
  }
  if (s.match(/([a-z])+/)) {  //小写字母
    ls++;
  }
  if (s.match(/([0-9])+/)) {  //数字
    ls++;
  }
  if (s.match(/([A-Z])+/)) {  //大写字母
    ls++;
  }

  ls++;
  /****************************************************
  if (s.match(/[^a-zA-Z0-9]+/)) {   //特殊字符
    ls++;
  }
  ***************************************************/
  return ls;
}
function isLowletter(a) {
  if (a.match(/([a-z])+/)) {
    return true;
  } else {
    return false;
  }
}
function isUpperletter(a) {
  if (a.match(/([A-Z])+/)) {
    return true;
  } else {
    return false;
  }
}
function isNum(a) {
  if (a.match(/([0-9])+/)) {
    return true;
  } else {
    return false;
  }
}
function isSpecial(a) {
  if (a.match(/[^a-zA-Z0-9]+/)) {
    return true;
  } else {
    return false;
  }
}


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      showRegisterinfo: false,
      showPassword: false,
      showConfirmPassword: false,
      visibleRegisterModal: false,
      visibleErrorModal: false,
      firstPassword: false,
      focusConfirmPwd: false,
      pwdCorrect: false,
      newPwd: "",
      confPwd: "",
      registerinfo: "",
      errorinfo: ""
    };

    this.register = this.register.bind(this);
    this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
    this.toggleErrorModal = this.toggleErrorModal.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleInputUsername = this.handleInputUsername.bind(this);
    this.handleInputChangePwd = this.handleInputChangePwd.bind(this);
    this.changeShowPassword = this.changeShowPassword.bind(this);
    this.changeShowConfirmPassword = this.changeShowConfirmPassword.bind(this);
    this.handleInputChangeConPwd = this.handleInputChangeConPwd.bind(this);
  }

  toggleRegisterModal() {
    var visibleRegisterModal = this.state.visibleRegisterModal;
    this.setState({ visibleRegisterModal: !visibleRegisterModal })
  }

  toggleErrorModal() {
    var visibleErrorModal = this.state.visibleErrorModal;
    this.setState({ visibleErrorModal: !visibleErrorModal })
  }


  changeShowPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }
  changeShowConfirmPassword() {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  }
  handleInputUsername(event) {
    this.setState({
      username: event.target.value
    })
  }
  handleInputChangePwd(event) {
    this.setState({
      firstPassword: true,
      newPwd: event.target.value
    });
    // console.log("newPwd", event.target.value);
  }
  handleInputChangeConPwd(event) {
    this.setState({
      confPwd: event.target.value
    });
    // console.log("confPwd", event.target.value);
  }
  handleAlertClose(event) {
    this.setState({
      showRegisterinfo: false,
      registerinfo: ""
    })
  }

  register() {
    const password = this.state.newPwd;
    const username = this.state.username;
    // console.log("register" + username + password)

    var errorinfo = "";

    var url = CONSTANT.Urls.registerUrl;
    // console.log(url);
    let register_list = {
      cli_req: "register",
      username: username,
      password: password
    };
    fetch(url, {
      method: 'POST',
      // credentials: 'include',
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain",
        'Accept': 'text/plain'
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
      //body: formData,
      body: JSON.stringify(register_list),
    }).then(res => res.json())
      .then((data) => {
        // console.log("server_response: " + data.ser_rsp);
        if (data.ser_rsp === "ok") {
          this.setState({visibleRegisterModal: true})
          this.props.isRegistered();    //switch to login
        } else if (data.ser_rsp === "no") {
          var registerinfo
          if (data.err_rsn === "existed username") {
            registerinfo = "用户名已存在"
          } else {
            registerinfo = "未知错误"
          }
          this.setState({ showRegisterinfo: true, registerinfo: registerinfo });
        }
      })
      .catch((error) => {
        // console.log('request failed', error)
        errorinfo = "服务器下线啦，嘤嘤嘤"
        this.setState({ visibleErrorModal: true, errorinfo: errorinfo })
      })

  }

  render() {
    return (
      <div>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Card>
              <CardHeader>
                <div style={{
                  textAlign: "center"
                }}>
                  <span style={{
                    fontSize: "32px"
                  }}>
                    注册<br />
                  </span>
                  <span style={{
                    fontSize: "20px"
                  }}>
                    Register
                      </span>
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md={{ size: 8, offset: 2 }}>
                      <FormGroup>
                        <label style={{
                          fontSize: "20px",
                          textAlign: "center"
                        }}>用户名 </label>
                        <label style={{
                          fontSize: "14px",
                          textAlign: "center"
                        }}>User name</label>
                        <Input
                          // defaultValue="无内鬼"
                          placeholder="无内鬼"
                          type="text"
                          key="username"
                          name="username"
                          onChange={this.handleInputUsername}
                          style={{
                            fontSize: "16px",
                            textAlign: "left"
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md={{ size: 8, offset: 2 }}>
                      <FormGroup>
                        <label style={{
                          fontSize: "20px",
                          textAlign: "center"
                        }}>设置密码 </label>
                        <label style={{
                          fontSize: "14px",
                          textAlign: "center"
                        }}>New Password</label>
                        <Row>
                          <Col md={{ size: 11, offset: 0 }}>
                            <Input
                              // defaultValue="无内鬼"
                              placeholder="New Password"
                              type={this.state.showPassword ? "text" : "password"}
                              key="password"
                              name="password"
                              onChange={this.handleInputChangePwd}
                              id="centerLabel"
                              style={{
                                fontSize: "16px",
                                textAlign: "left"
                              }}
                            />
                          </Col>
                          <Col>
                            <Icon type={this.state.showPassword ? "eye" : "eye-invisible"} id="checkIcon"
                              theme="twoTone" twoToneColor="#eb2f96"
                              onClick={this.changeShowPassword}
                            />
                          </Col>
                        </Row>
                        <Row >
                          <Col md={{ size: 8, offset: 0 }}>
                            <span
                              className="errorTip"
                              style={{
                                color: "#bfbfbf",
                                display:
                                  isSimplePwd(this.state.newPwd) === 5
                                    ? "none"
                                    : "inline-block"
                              }}
                            >
                              {this.state.newPwd.length < 8
                                ? "密码最小长度为8"
                                : isLowletter(this.state.newPwd) === false
                                  ? "需要小写英文字母"
                                  : isNum(this.state.newPwd) === false
                                    ? "需要数字"
                                    : isUpperletter(this.state.newPwd) === false
                                      ? "需要大写英文字母"
                                      : isSpecial(this.state.newPwd) === false
                                        ? "需要特殊字符"
                                        : "OK"}
                            </span>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md={{ size: 8, offset: 2 }}>
                      <FormGroup>
                        <label style={{
                          fontSize: "20px",
                          textAlign: "center"
                        }}>确认密码 </label>
                        <label style={{
                          fontSize: "14px",
                          textAlign: "center"
                        }}>Confirm Password</label>
                        <Row>
                          <Col md={{ size: 11, offset: 0 }}>
                            {isSimplePwd(this.state.newPwd) === 5 ? (
                              <Input
                                placeholder="Confirm Password"
                                type={this.state.showConfirmPassword ? "text" : "password"}
                                key="password"
                                name="password"
                                onChange={this.handleInputChangeConPwd}
                                id="centerLabelConfirm"
                                style={{
                                  fontSize: "16px",
                                  textAlign: "left"
                                }}
                              />
                            ) : (
                                <Input
                                  placeholder="Confirm Password"
                                  type={this.state.showConfirmPassword ? "text" : "password"}
                                  key="password"
                                  name="password"
                                  onChange={this.handleInputChangeConPwd}
                                  id="centerLabelConfirm"
                                  disabled
                                />
                              )}
                          </Col>
                          <Col>
                            <Icon type={this.state.showConfirmPassword ? "eye" : "eye-invisible"} id="checkIcon"
                              theme="twoTone" twoToneColor="#eb2f96"
                              onClick={this.changeShowConfirmPassword}
                              id="centerIconConfirm"
                            />
                          </Col>
                          <Col>
                            <div className="iconBoxTotal">
                              <span
                                className="matchTip"
                                style={{
                                  display:
                                    this.state.newPwd === this.state.confPwd &&
                                      isSimplePwd(this.state.newPwd) === 5
                                      ? "inline-block"
                                      : "none"
                                }}
                              >
                                Match
                          </span>
                            </div>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <div style={{
                  textAlign: "center"
                }}>
                  {(this.state.newPwd === this.state.confPwd && this.state.confPwd !== "" && this.state.username !== "") ? (
                    <Button className="btn-fill" color="primary" type="submit"
                      onClick={this.register}>
                      注册
                  </Button>
                  ) : (
                      <Button className="btn-fill" color="primary" type="submit"
                        onClick={this.register} disabled>
                        注册
                    </Button>
                    )}
                </div>
                <div>
                  <Alert color="danger" isOpen={this.state.showRegisterinfo} toggle={this.handleAlertClose} fade={true}>
                    {this.state.registerinfo}
                  </Alert>
                </div>
              </CardFooter>
            </Card>
          </Col >
        </Row >
        <Row>
          <Modal isOpen={this.state.visibleRegisterModal} centered={true} id="SucessInfo">
          <ModalHeader toggle={this.toggleRegisterModal} >
            <div style={{ fontSize: "24px" }}>注册成功 </div>
            <div style={{ fontSize: "18px" }}>Success</div>
          </ModalHeader>
          <ModalBody>
            <div style={{ fontSize: "18px" }}>
              {'注册用户名: ' + this.state.username}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-simple" color="info" onClick={this.toggleRegisterModal}><div style={{ fontSize: "18px" }}>OK</div></Button>
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
        </Row>        
      </div>
    )
  }
}

export default Register;