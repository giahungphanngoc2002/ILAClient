import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUp from "../pages/SignUpPage/SignUp";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true
  },
  {
    path: "/signin",
    page: SignInPage,
    isShowHeader: false
  },
  {
    path: "/signup",
    page: SignUp,
    isShowHeader: false
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
