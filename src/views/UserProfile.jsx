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

import { connect } from "react-redux";
import { getUsername } from "../redux/selectors";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

// reactstrap components
import {
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
  Col
} from "reactstrap";

class UserProfile extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      username: cookies.get('username') || 'Default Name'
    }
  }
  
  componentDidMount() {
    console.log(this.props)
    // const usr = mapStateToProps(this.state)
    // console.log(usr)
  }


  render() {
    return (
      <div className="content">
        <Row>
          <Card>
            <CardHeader>
              <h3 className="title">个人资料 Profile</h3>
            </CardHeader>
            <CardBody>
              <CardText />
              <div className="author">
                {/* <div className="block block-one" />
                <div className="block block-two" />
                <div className="block block-three" />
                <div className="block block-four" /> */}
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img
                    alt="..."
                    // className="avatar"
                    src={require("assets/img/emilyz.jpg")}
                    height="200"
                    width="200"
                  />
                  <h3 className="title">{this.state.username}</h3>
                </a>
                <p className="description">simple profile only name</p>
              </div>
              <div className="card-description">
              There are only two tragedies in life: one is not getting what one wants, and the other is getting it
              </div>
            </CardBody>
          </Card>
        </Row>
        <div>
          
        </div>
      </div>

      // <>
      //   <div className="content">
      //     <Row>
      //       <Col md="8">
      //         <Card>
      //           <CardHeader>
      //             <h5 className="title">Edit Profile</h5>
      //           </CardHeader>
      //           <CardBody>
      //             <Form>
      //               <Row>
      //                 <Col className="pr-md-1" md="5">
      //                   <FormGroup>
      //                     <label>Company (disabled)</label>
      //                     <Input
      //                       defaultValue="Creative Code Inc."
      //                       disabled
      //                       placeholder="Company"
      //                       type="text"
      //                     />
      //                   </FormGroup>
      //                 </Col>
      //                 <Col className="px-md-1" md="3">
      //                   <FormGroup>
      //                     <label>Username</label>
      //                     <Input
      //                       defaultValue="michael23"
      //                       placeholder="Username"
      //                       type="text"
      //                     />
      //                   </FormGroup>
      //                 </Col>
      //                 <Col className="pl-md-1" md="4">
      //                   <FormGroup>
      //                     <label htmlFor="exampleInputEmail1">
      //                       Email address
      //                     </label>
      //                     <Input placeholder="mike@email.com" type="email" />
      //                   </FormGroup>
      //                 </Col>
      //               </Row>
      //               <Row>
      //                 <Col className="pr-md-1" md="6">
      //                   <FormGroup>
      //                     <label>First Name</label>
      //                     <Input
      //                       defaultValue="Mike"
      //                       placeholder="Company"
      //                       type="text"
      //                     />
      //                   </FormGroup>
      //                 </Col>
      //                 <Col className="pl-md-1" md="6">
      //                   <FormGroup>
      //                     <label>Last Name</label>
      //                     <Input
      //                       defaultValue="Andrew"
      //                       placeholder="Last Name"
      //                       type="text"
      //                     />
      //                   </FormGroup>
      //                 </Col>
      //               </Row>
      //               <Row>
      //                 <Col md="12">
      //                   <FormGroup>
      //                     <label>Address</label>
      //                     <Input
      //                       defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
      //                       placeholder="Home Address"
      //                       type="text"
      //                     />
      //                   </FormGroup>
      //                 </Col>
      //               </Row>
      //               <Row>
      //                 <Col className="pr-md-1" md="4">
      //                   <FormGroup>
      //                     <label>City</label>
      //                     <Input
      //                       defaultValue="Mike"
      //                       placeholder="City"
      //                       type="text"
      //                     />
      //                   </FormGroup>
      //                 </Col>
      //                 <Col className="px-md-1" md="4">
      //                   <FormGroup>
      //                     <label>Country</label>
      //                     <Input
      //                       defaultValue="Andrew"
      //                       placeholder="Country"
      //                       type="text"
      //                     />
      //                   </FormGroup>
      //                 </Col>
      //                 <Col className="pl-md-1" md="4">
      //                   <FormGroup>
      //                     <label>Postal Code</label>
      //                     <Input placeholder="ZIP Code" type="number" />
      //                   </FormGroup>
      //                 </Col>
      //               </Row>
      //               <Row>
      //                 <Col md="8">
      //                   <FormGroup>
      //                     <label>About Me</label>
      //                     <Input
      //                       cols="80"
      //                       defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
      //                       that two seat Lambo."
      //                       placeholder="Here can be your description"
      //                       rows="4"
      //                       type="textarea"
      //                     />
      //                   </FormGroup>
      //                 </Col>
      //               </Row>
      //             </Form>
      //           </CardBody>
      //           <CardFooter>
      //             <Button className="btn-fill" color="primary" type="submit">
      //               Save
      //             </Button>
      //           </CardFooter>
      //         </Card>
      //       </Col>
      //       <Col md="4">
      //         <Card className="card-user">
      //           <CardBody>
      //             <CardText />
      //             <div className="author">
      //               <div className="block block-one" />
      //               <div className="block block-two" />
      //               <div className="block block-three" />
      //               <div className="block block-four" />
      //               <a href="#pablo" onClick={e => e.preventDefault()}>
      //                 <img
      //                   alt="..."
      //                   className="avatar"
      //                   src={require("assets/img/emilyz.jpg")}
      //                 />
      //                 <h5 className="title">Mike Andrew</h5>
      //               </a>
      //               <p className="description">Ceo/Co-Founder</p>
      //             </div>
      //             <div className="card-description">
      //               Do not be scared of the truth because we need to restart the
      //               human foundation in truth And I love you like Kanye loves
      //               Kanye I love Rick Owens’ bed design but the back is...
      //             </div>
      //           </CardBody>
      //           <CardFooter>
      //             <div className="button-container">
      //               <Button className="btn-icon btn-round" color="facebook">
      //                 <i className="fab fa-facebook" />
      //               </Button>
      //               <Button className="btn-icon btn-round" color="twitter">
      //                 <i className="fab fa-twitter" />
      //               </Button>
      //               <Button className="btn-icon btn-round" color="google">
      //                 <i className="fab fa-google-plus" />
      //               </Button>
      //             </div>
      //           </CardFooter>
      //         </Card>
      //       </Col>
      //     </Row>
      //   </div>
      // </>
    );
  }
}

// function mapStateToProps(state) {
//   return ({
//     username: getUsername(state)
//     // username: "111"
//   })
// }

// export default connect(mapStateToProps)(UserProfile);
// export default connect(mapStateToProps)(UserProfile);
export default withCookies(UserProfile)
