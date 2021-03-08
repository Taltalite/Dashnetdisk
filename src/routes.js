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
import Diskfile from "views/Diskfile.jsx";
import Notifications from "views/Notifications.jsx";
import TableList from "views/TableList.jsx";
import UserProfile from "views/UserProfile.jsx";

var routes = [
  {
    path: "/diskfile",
    name: "Disk File",
    icon: "tim-icons icon-istanbul",
    component: Diskfile,
    layout: "/dashnetdisk"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/dashnetdisk"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/dashnetdisk"
  },
  {
    path: "/tables",
    name: "Trans Queue",
    icon: "tim-icons icon-cloud-download-93",
    component: TableList,
    layout: "/dashnetdisk"
  },
];
export default routes;
