import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUp from "../pages/SignUpPage/SignUp";
import Profile from "../pages/ProfilePage/ProfilePage";
import HomePageTeacher from "../pages/HomePage/HomePageTeacher";
import QuestionAI from "../pages/Teacher/SearchQuestionByAI";
import MyClass from "../pages/Teacher/MyClass";
import Quiz from "../pages/Quiz/Quiz";
import Review from "../pages/Review/Review";
import Result from "../pages/Result/Result";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true
  },
  {
    path: "/teacher",
    page: HomePageTeacher,
    isShowHeader: true
  },
  {
    path: "/questionAI/:id",
    page: QuestionAI,
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
    path: "/profile",
    page: Profile,
    isShowHeader: true
  },
  {
    path: "/myclass",
    page: MyClass,
    isShowHeader: true
  },
  {
    path: "/quiz/:id",
    page: Quiz,
    isShowHeader: true
  },
  {
    path: "/result",
    page: Result,
    isShowHeader: true
  },
  {
    path: "/review/:id",
    page: Review,
    isShowHeader: true
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
