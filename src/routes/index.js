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
    path: "teacher/gradeTable",
    page: GradeTable,
    isShowHeader: false,
  },
  {
    path: "teacher/teachingMaterial",
    page: TeachingMaterials,
    isShowHeader: false,
  },
  {
    path: "teacher/attendanceTable",
    page: AttendanceTable,
    isShowHeader: false,
  },
  {
    path: `teacher/class/:id`,
    page: StudentTable,
    isShowHeader: false,
  },
  {
    path: "/teacher/*",
    page: Teacher,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "teacher/calender/",
    page: Calendar,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "teacher/calender/:idClass",
    page: StudentTable,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/teacher/myClass",
    page: MyClasses,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/teacher/profile",
    page: Profile,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/teacher/notification",
    page: Notifications,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/teacher/classDivision",
    page: ClassDivision,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/teacher/manageSchedule",
    page: ManageSchedule,
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
