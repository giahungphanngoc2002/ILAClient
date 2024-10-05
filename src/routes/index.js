import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUp from "../pages/SignUpPage/SignUp";
import Profile from "../pages/ProfilePage/ProfilePage";
import RequestPasswordReset from "../pages/forgotpassword/RequestPasswordReset";
import ResetPassword from "../pages/forgotpassword/ResetPassword";
import ChangePassword from "../pages/ChangePassWord/ChangePassWord";
import Admin from "../pages/Admin/Admin";


export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/changePassword",
    page: ChangePassword,
    isShowHeader: true,
  },
  {
    path: "/signin",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/signup",
    page: SignUp,
    isShowHeader: false,
  },
  {
    path: "/requestPasswordReset",
    page: RequestPasswordReset,
    isShowHeader: false,
  },
  {
    path: "/passwordReset/:resetToken",
    page: ResetPassword,
    isShowHeader: false,
  },
  // {
  //   path: "/activation/:activation_token",
  //   page: ActivationPage,
  //   isShowHeader: false,
  // },
  {
    path: "/profile",
    page: Profile,
    isShowHeader: true,
  },
  {
    path: "/admin/*",
    page: Admin,
    isShowHeader: false,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
