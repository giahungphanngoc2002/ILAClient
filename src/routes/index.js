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
import ProtectedRoute from "../routes/ProtectedRoute"; // Đảm bảo bạn đã import ProtectedRoute
import SelfLearning from "../pages/SelfLearning/SelfLearning";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowSideBar: false,
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
  {
    path: "/profile",
    page: () => (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    isShowHeader: true,
  },
  {
    path: "manage/gradeTable/:idSubject/:idClass/:semester",
    page: () => (
      <ProtectedRoute>
        <GradeTable />
      </ProtectedRoute>
    ),
    isShowHeader: false,
  },
  {
    path: "manage/teachingMaterial/:idClass/:idSubject",
    page: () => (
      <ProtectedRoute>
        <TeachingMaterials />
      </ProtectedRoute>
    ),
    isShowHeader: false,
  },
  {
    path: "manage/attendanceTable/:idClass/:idSubject/:idSlot",
    page: () => (
      <ProtectedRoute>
        <AttendanceTable />
      </ProtectedRoute>
    ),
    isShowHeader: false,
  },
  {
    path: `manage/class/:id`,
    page: () => (
      <ProtectedRoute>
        <StudentTable />
      </ProtectedRoute>
    ),
    isShowHeader: false,
  },
  {
    path: "/manage/*",
    page: () => (
      <ProtectedRoute>
        <Teacher />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/student/*",
    page: () => (
      <ProtectedRoute>
        <Teacher />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "manage/calender/",
    page: () => (
      <ProtectedRoute>
        <Calendar />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "manage/questionManage/",
    page: () => (
      <ProtectedRoute>
        <QuestionManager />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "manage/calender/:idClass/:idSchedule/:idSlot/:idSubject/:semester",
    page: () => (
      <ProtectedRoute>
        <StudentTable />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/myClass",
    page: () => (
      <ProtectedRoute>
        <MyClasses />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/profile",
    page: () => (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/notification",
    page: () => (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/classDivision",
    page: () => (
      <ProtectedRoute>
        <ClassDivision />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/manageSchedule",
    page: () => (
      <ProtectedRoute>
        <ManageSchedule />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/student/timeTable",
    page: () => (
      <ProtectedRoute>
        <TimeTable />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/student/selfLearning",
    page: () => (
      <ProtectedRoute>
        <SelfLearning />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
