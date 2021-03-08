import React from 'react';

import { Icon } from 'antd';
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { userLog } from "../../redux/actions";

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
import { USER_LOG } from '../../redux/actionTypes';



class Login extends React.Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      login: false,
      showPassword: false,
      showLoginfo: false,
      visibleErrorModal: false,
      loginfo: "",
      username: "",
      password: "",
      userid: "",
      errorinfo: ""
    };

    this.userLogin = this.userLogin.bind(this);
    this.toggleErrorModal = this.toggleErrorModal.bind(this);
    this.handleRedux = this.handleRedux.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleInputUsername = this.handleInputUsername.bind(this);
    this.handleInputPassword = this.handleInputPassword.bind(this);
    this.changeShowPassword = this.changeShowPassword.bind(this);
  }

  componentDidMount() {
    const { cookies } = this.props;
    cookies.set('userid', '', { path: '/' })  //cookie
    cookies.set('username', '', { path: '/' })  //cookie
    cookies.set('parentpath', '/', { path: '/' })   //cookie
    cookies.set('login', 'no', { path: '/' })   //cookie
  }

  changeShowPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  toggleErrorModal() {
    var visibleErrorModal = this.state.visibleErrorModal;
    this.setState({ visibleErrorModal: !visibleErrorModal })
  }

  handleInputUsername(event) {
    // console.log(event.target.value)
    this.setState({
      username: event.target.value
    })
  }

  handleInputPassword(event) {
    this.setState({
      password: event.target.value
    })
  }
  handleAlertClose(event) {
    this.setState({
      showLoginfo: false,
      loginfo: ""
    })
  }

  userLogin() {
    const { cookies } = this.props;
    const username = this.state.username
    const password = this.state.password
    // console.log("user login. username: " + username + " password: " + password)

    var errorinfo = "";

    var url = CONSTANT.Urls.loginUrl;
    // console.log(url);
    let login_list = {
      cli_req: "login",
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
      body: JSON.stringify(login_list),
    }).then(res => res.json())
      .then((data) => {
        // console.log("server_response: " + data.ser_rsp);
        if (data.ser_rsp === "ok") {
          var userid = data.user_id;
          // this.props.userLog(userid,this.state.username);    //redux 分发userid,username
          // cookie.save('userid',userid)              //cookie
          cookies.set('userid', userid, { path: '/' })  //cookie
          cookies.set('username', this.state.username, { path: '/' })  //cookie
          cookies.set('parentpath', '/', { path: '/' })   //cookie
          cookies.set('login', 'yes', { path: '/' })   //cookie
          this.setState({ login: true });
        } else if (data.ser_rsp === "no") {
          var loginfo
          if (data.err_rsn === "no-exist username") {
            loginfo = "不存在这个用户名"
          } else if (data.err_rsn === "wrong password") {
            loginfo = "密码错误"
          } else {
            loginfo = "未知错误"
          }
          this.setState({ login: false, showLoginfo: true, loginfo: loginfo });
        }
      })
      .catch((error) => {
        // console.log('request failed', error)
        errorinfo = "服务器下线啦，嘤嘤嘤"
        this.setState({ visibleErrorModal: true, errorinfo: errorinfo })
      })
  }

  handleRedux() {
    this.props.userLog(this.state.username);    //redux 分发username
    // console.log(this.state.username)
  }

  render() {
    if (this.state.login) {
      return (<Redirect to="/dashnetdisk/diskfile" />)
    }

    return (
      <div>
        {/* <Button onClick={this.handleRedux}>
          憨批redux，给👴爬
        </Button> */}
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
                    登录<br />
                  </span>
                  <span style={{
                    fontSize: "20px"
                  }}>
                    Log in
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
                        }}>密码 </label>
                        <label style={{
                          fontSize: "14px",
                          textAlign: "center"
                        }}>Password</label>
                        <Row>
                          <Col md={{ size: 11, offset: 0 }}>
                            <Input
                              // defaultValue="继续交易"
                              placeholder="继续交易"
                              type={this.state.showPassword ? "text" : "password"}
                              key="password"
                              name="password"
                              onChange={this.handleInputPassword}
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
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <div style={{
                  textAlign: "center"
                }}>
                  {(this.state.username !== "" && this.state.password !== "") ? (
                    <Button className="btn-fill" color="primary" type="submit"
                      onClick={this.userLogin}>
                      登录
                  </Button>
                  ) : (
                      <Button className="btn-fill" color="primary" type="submit"
                        onClick={this.userLogin} disabled >
                        登录
                  </Button>
                    )}
                </div>
                <div>
                  <Alert color="danger" isOpen={this.state.showLoginfo} toggle={this.handleAlertClose} fade={true}>
                    {this.state.loginfo}
                  </Alert>
                </div>
              </CardFooter>
              {/* <Row>
                <Col className="pr-md-1" md="10">
                  <FormGroup>
                    <label>永远无法抵达的真实</label>
                    <Input
                      defaultValue="汤晨宇 郑少宇 覃文俊 李骏垚"
                      disabled
                      placeholder="Company"
                      type="text"
                    />
                  </FormGroup>
                </Col>
              </Row> */}
            </Card>
          </Col>
        </Row>
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
      </div>

    )
  }
}


// export default connect(
//   null,
//   { userLog }
// )(Login);

export default withCookies(Login)

// export default Login;