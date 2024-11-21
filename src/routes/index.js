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
import Quiz from "../pages/Quiz/Quiz";
import AttendanceStudent from "../pages/AttendanceStudent/AttendanceStudent";
import Report from "../pages/Report/Report";
import FormReport from "../pages/FormReport/FormReport";
import InfoSlot from "../pages/InfoSlot/InfoSlot";
import NotificationToStudent from "../pages/NotificationToStudent/NotificationToStudent";
import HistorySendNotification from "../pages/HistorySendNotification/HistorySendNotification";
import ExamSchedule from "../pages/ExamSchedule/ExamSchedule";
import Message from "../pages/Message/Message";
import QuestionAI from "../pages/QuestionManage/goToCreateQuestionByAI";
import AddAbsenceRequest from "../pages/AddAbsenceRequest/AddAbsenceRequest";
import ProfileStudentInClass from "../pages/ProfileStudentInClass/ProfileStudentInClass";
import THRSendNoti from "../pages/THRSendNotification/THRSendNoti";
import ScoreTableStudent from "../pages/ScoreTableStudent/ScoreTableStudent";
import ConductEvaluation from "../pages/ConductEvaluation/ConductEvaluation";
import ManageClass from "../pages/ManageClass/ManageClass";
import StudentViewExamSchedule from "../pages/StudentViewExamSchedule/StudentViewExamSchedule";
import AutoCreateAccount from "../pages/AutoCreateAccount/AutoCreateAccount";
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
    path: "manage/questionManage/:idClass/:idSubject",
    page: () => (
      <ProtectedRoute>
        <QuestionManager />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/questionAI/:idClass/:idSubject",
    page: () => (
      <ProtectedRoute>
        <QuestionAI />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "manage/calender/:idClass/:idSchedule/:idSlot/:idSubject",
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
    path: "/manage/message",
    page: () => (
      <ProtectedRoute>
        <Message />
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
    path: "/manage/report",
    page: () => (
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/report/formReport",
    page: () => (
      <ProtectedRoute>
        <FormReport />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/notificationToStudent",
    page: () => (
      <ProtectedRoute>
        <NotificationToStudent />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/manage/historySendNotification",
    page: () => (
      <ProtectedRoute>
        <HistorySendNotification />
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
    path: "/manage/examSchedule",
    page: () => (
      <ProtectedRoute>
        <ExamSchedule />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: true,
  },
  {
    path: "/manage/addAbsenceRequest/:idClass",
    page: () => (
      <ProtectedRoute>
        <AddAbsenceRequest />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },

  {
    path: "/manage/profileStudentInClass/:idClass",
    page: () => (
      <ProtectedRoute>
        <ProfileStudentInClass />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/manage/scoreTableStudent",
    page: () => (
      <ProtectedRoute>
        <ScoreTableStudent />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/manage/thrNotification/:idClass",
    page: () => (
      <ProtectedRoute>
        <THRSendNoti />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/manage/conductEvaluation/:idClass",
    page: () => (
      <ProtectedRoute>
        <ConductEvaluation />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/manage/manageClass",
    page: () => (
      <ProtectedRoute>
        <ManageClass />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/manage/autoCreateAccount",
    page: () => (
      <ProtectedRoute>
        <AutoCreateAccount />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
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
    path: "/student/timeTable/infoSlot/:idSchedule/:idSlot",
    page: () => (
      <ProtectedRoute>
        <InfoSlot />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/student/message",
    page: () => (
      <ProtectedRoute>
        <Message />
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
    path: "/student/selfLearning/quiz/:idSubject",
    page: () => (
      <ProtectedRoute>
        <Quiz />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/student/attendaceStudent",
    page: () => (
      <ProtectedRoute>
        <AttendanceStudent />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "/manage/student/viewExamSchedule",
    page: () => (
      <ProtectedRoute>
        <StudentViewExamSchedule />
      </ProtectedRoute>
    ),
    isShowHeader: false,
    isShowSideBar: false,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];