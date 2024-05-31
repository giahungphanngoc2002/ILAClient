import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUp from "../pages/SignUpPage/SignUp";
import Profile from "../pages/ProfilePage/ProfilePage";
import HomePageTeacher from "../pages/HomePage/HomePageTeacher";
import QuestionAI from "../pages/Teacher/SearchQuestionByAI";
import Quizz from "../pages/Quizz/Quizz";
import MyClass from "../pages/Teacher/MyClass";

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
    path: "/questionAI",
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
    path: "/quiz",
    page: Quizz,
    isShowHeader: true
  },
  {
    path: "/myClass",
    page: MyClass,
    isShowHeader: true
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
