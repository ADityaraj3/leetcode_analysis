// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import { getCookie } from "utlis/cookieUtils";
import Logout from "layouts/authentication/log-out";
import TopicDetail from "layouts/topicDetails";

const isAuthenticated = () => {
  return getCookie('userName') !== ''; // Check if the userName cookie exists
};

const routes = [
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
  {
    type: "collapse",
    name: isAuthenticated() ? "Logout" : "Sign In",
    key: isAuthenticated() ? "logout" : "sign-in",
    icon: <Icon fontSize="small">{isAuthenticated() ? "logout" : "login"}</Icon>,
    route: isAuthenticated() ? "/logout" : "/authentication/sign-in",
    component: isAuthenticated() ? <Logout /> : <SignIn />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    private: true, // Mark as private route
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
    private: true, // Mark as private route
  },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  //   private: true, // Mark as private route
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  //   private: true, // Mark as private route
  // },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    private: true, // Mark as private route
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    private: true, // Mark as private route
  },
  {
    type: "collapse",
    name: "Topic Detail",
    key: "topic-detail",
    icon: <Icon fontSize="small">topic</Icon>,
    route: "/topicDetail/:topicName/:totalQuestions/:problemsSolved",
    component: <TopicDetail />,
    private: true, // Mark as private route if needed
  },
];

export default routes;


