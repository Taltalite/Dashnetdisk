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
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { CookiesProvider } from 'react-cookie';

import AdminLayout from "./layouts/Admin/Admin.jsx";

import LoginAndRegister from './layouts/LoginAndRegister.jsx';

import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";

const hist = createBrowserHistory();

ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <Router history={hist}>
        <Switch>
          <Route path="/LoginAndRegister" component={LoginAndRegister}></Route>
          <Route path="/dashnetdisk" render={props => <AdminLayout {...props} />} />
          <Redirect from="/" to="/LoginAndRegister" />
        </Switch>
      </Router>
    </Provider>
  </CookiesProvider>,
  document.getElementById("root")
);
