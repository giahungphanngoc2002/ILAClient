import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUp from "../pages/SignUpPage/SignUp";
import Profile from "../pages/ProfilePage/ProfilePage";
import HomePageTeacher from "../pages/HomePage/HomePageTeacher";
import QuestionAI from "../pages/Teacher/SearchQuestionByAI";
import MyClass from "../pages/Teacher/MyClass";
import Quiz from "../pages/Quiz/Quiz";
import QuizTest from "../pages/Quiz/QuizTest";
import Review from "../pages/Review/Review";
import Result from "../pages/Result/Result";
import ViewClass from "../pages/Teacher/ViewClass";
import HistoryStudent from "../pages/Student/HistoryStudent";
import Result2 from "../pages/Result/Result2";
import ResultAssigment from "../pages/Result/ResultAssigment";
import ActivationPage from "../pages/ActivationPage/ActivationPage";
import RequestPasswordReset from "../pages/forgotpassword/RequestPasswordReset";
import ResetPassword from "../pages/forgotpassword/ResetPassword";
import ChangePassword from "../pages/ChangePassWord/ChangePassWord";
import ViewQuestionTest from "../pages/ViewInfoTest/ViewInfoTest";
import TeacherInboxPage from "../pages/Teacher/TeacherInboxPage";
import PricingCount from "../pages/PricingCount/PricingCount";
import Admin from "../pages/Admin/Admin";
import PaymentSuccess from "../pages/PricingCount/PaymentSuccess";


export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/teacher",
    page: HomePageTeacher,
    isShowHeader: true,
  },
  {
    path: "/changePassword",
    page: ChangePassword,
    isShowHeader: true,
  },
  {
    path: "/questionAI/:id",
    page: QuestionAI,
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
  //message teacher
  {
    path: "/all-messages",
    page: TeacherInboxPage,
    isShowHeader: true,
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
  {
    path: "/activation/:activation_token",
    page: ActivationPage,
    isShowHeader: false,
  },
  {
    path: "/quizTest/:idClass/:idTest",
    page: QuizTest,
    isShowHeader: true,
  },
  {
    path: "/profile",
    page: Profile,
    isShowHeader: true,
  },
  {
    path: "/myclass",
    page: MyClass,
    isShowHeader: true,
  },
  {
    path: "/quiz/:id",
    page: Quiz,
    isShowHeader: true,
  },
  {
    path: "/result",
    page: Result,
    isShowHeader: true,
  },
  {
    path: "/review/:assignment/:id",
    page: Review,
    isShowHeader: true,
  },
  {
    path: "/review/:learning/:id",
    page: Review,
    isShowHeader: true,
  },
  {
    path: "/viewClass/:id",
    page: ViewClass,
    isShowHeader: true,
  },
  {
    path: "/historyStudent/:id",
    page: HistoryStudent,
    isShowHeader: true,
  },
  {
    path: "/detailHistory/:id",
    page: Result2,
    isShowHeader: true,
  },
  {
    path: "/detailAssigment/:id",
    page: ResultAssigment,
    isShowHeader: true,
  },
  {
    path: "/detailTest/:id",
    page: ViewQuestionTest,
    isShowHeader: true,
  },
  {
    path: "/pricingCount/",
    page: PricingCount,
    isShowHeader: true,
  },
  {
    path: "/admin/*",
    page: Admin,
    isShowHeader: false,
  },
  {
    path: "/paymentSuccess/",
    page: PaymentSuccess,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
