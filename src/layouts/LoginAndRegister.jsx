import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Login from '../components/logregister/Login.jsx';
import Register from '../components/logregister/Register.jsx';

import Headimg from '../assets/img/Loginheader1.jpg';


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
    Col,
    Container
} from "reactstrap";



class LoginAndRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseOpen: false,
            modalSearch: false,
            color: "navbar-transparent",
            tabvalue: 0,    //0 是 login
        };
    }


    handleChange = (event, newValue) => {
        console.log(event.target.value);
        var tabvalue = this.state.tabvalue;
        tabvalue = newValue;
        this.setState({ tabvalue: tabvalue })
    };

    switchToLogin = () => {
        this.setState({ tabvalue: 0 })
    };

    render() {
        function a11yProps(index) {
            return {
                id: `simple-tab-${index}`,
                'aria-controls': `simple-tabpanel-${index}`,
            };
        }

        function TabPanel(props) {
            const { children, value, index, ...other } = props;

            return (
                <Typography
                    component="div"
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple-tabpanel-${index}`}
                    aria-labelledby={`simple-tab-${index}`}
                    {...other}
                >
                    {value === index && <Box p={3}>{children}</Box>}
                </Typography>
            );
        }
        console.log(this.state.tabvalue)
        return (
            <div className="content">
                <div>
                    <img src={Headimg} />
                </div>
                <Container className="themed-container">
                    <Row>
                        <Col sm={{ size: 10, offset: 1 }}>
                            <Paper square>
                                {/* <AppBar position="static"> */}
                                <Tabs value={this.state.tabvalue} onChange={this.handleChange} aria-label="simple tabs example" centered>
                                    <Tab label="Login" {...a11yProps(0)} />
                                    <Tab label="Register" {...a11yProps(1)} />
                                </Tabs>
                                {/* </AppBar> */}
                            </Paper>
                        </Col>
                    </Row>

                </Container>
                <TabPanel value={this.state.tabvalue} index={0}>
                    <Login />
                </TabPanel>
                <TabPanel value={this.state.tabvalue} index={1}>
                    <Register isRegistered={this.switchToLogin} />
                </TabPanel>
            </div>
        )
    }
}

export default LoginAndRegister;