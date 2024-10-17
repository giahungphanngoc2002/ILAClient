import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUp from "../pages/SignUpPage/SignUp";
import Profile from "../pages/ProfilePage/ProfilePage";
import RequestPasswordReset from "../pages/forgotpassword/RequestPasswordReset";
import ResetPassword from "../pages/forgotpassword/ResetPassword";
import ChangePassword from "../pages/ChangePassWord/ChangePassWord";
import Teacher from "../pages/Teacher/Teacher";
import GradeTable from "../pages/GradeTable/GradeTable";
import TeachingMaterials from "../pages/TeachingMaterial/TeachingMaterial";
import StudentTable from "../pages/Teacher/StudentTable";
import Calendar from "../pages/Teacher/Calender";
import MyClasses from "../pages/MyClasses/MyClasses";
import AttendanceTable from "../pages/AttendanceTable/AttendanceTable";
import Notifications from "../pages/Notification/Notifications";
import ClassDivision from "../pages/ClassDivision/ClassDivision";
import ManageSchedule from "../pages/ManageSchedule/ManageSchedule";
import QuestionManager from "../pages/QuestionManage/QuestionManage";
import TimeTable from "../pages/TimeTable/TimeTable";


export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowSideBar: false,
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
    path: "manage/gradeTable/:idSubject/:idClass/:semester",
    page: GradeTable,
    isShowHeader: false,
  },
  {
    path: "manage/teachingMaterial",
    page: TeachingMaterials,
    isShowHeader: false,
  },
  {
    path: "manage/attendanceTable",
    page: AttendanceTable,
    isShowHeader: false,
  },
  {
    path: `manage/class/:id`,
    page: StudentTable,
    isShowHeader: false,
  },
  {
    path: "/manage/*",
    page: Teacher,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/student/*",
    page: Teacher,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "manage/calender/",
    page: Calendar,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "manage/questionManage/",
    page: QuestionManager,
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "manage/calender/:idClass/:idSchedule/:idSlot/:idSubject/:semester",
    page: StudentTable,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/myClass",
    page: MyClasses,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/profile",
    page: Profile,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/notification",
    page: Notifications,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/classDivision",
    page: ClassDivision,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/manageSchedule",
    page: ManageSchedule,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/student/timeTable",
    page: TimeTable,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
