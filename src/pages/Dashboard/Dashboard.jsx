import React, { useEffect, useState } from 'react';
import { GrScorecard } from "react-icons/gr";
import { FaBook } from "react-icons/fa";
import { FaClipboardQuestion } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import * as ClassService from "../../services/ClassService";
import { useNavigate } from 'react-router-dom';
import { BiMailSend } from "react-icons/bi";
import { CalendarClock } from 'lucide-react';
import { AiOutlineTrophy } from "react-icons/ai";
import { AiOutlineSchedule } from "react-icons/ai";
import { SiGoogleclassroom } from "react-icons/si";
import { FaUserPlus } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { FaClipboardUser } from "react-icons/fa6";
import { TbSquareLetterA } from "react-icons/tb";
import { MdStars } from "react-icons/md";

const Dashboard = () => {
    const user = useSelector((state) => state.user);

    const [teacherId, setTeacherId] = useState(user?.id);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjects, setSubjects] = useState([]); // Môn học của giáo viên
    const [selectedCard, setSelectedCard] = useState(null);
    const [classHR, setClassHR] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setTeacherId(user?.id);
    }, [user]);

    useEffect(() => {
        const fetchSubject = async () => {
            setIsLoading(true);
            try {
                const response = await ClassService.getAllSubjectClassesByTeacherId(teacherId);
                console.log('Full API response data:', response);
                if (response && response.data && response.data.classes) {
                    setClasses(response.data.classes);
                } else {
                    console.error('Unexpected API response structure', response);
                    setClasses([]);
                }
                setIsError(false);
            } catch (error) {
                setIsError(true);
                console.error('Error fetching schedule data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === "Teacher" && teacherId) {
            fetchSubject();
        }
    }, [user?.role, teacherId]);

    console.log()


    useEffect(() => {
        if (!teacherId) return;
        const fetchDetailClassByTeacherHR = async () => {
            setIsLoading(true);
            try {
                const response = await ClassService.getDetailClassByTeacherHR(teacherId);
                if (response && response.data) {
                    setClassHR(response.data);
                } else {
                    console.error('Unexpected API response structure', response);
                    setClassHR([]);
                }

                setIsError(false);
            } catch (error) {
                setIsError(true);
                console.error('Error fetching schedule data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetailClassByTeacherHR();
    }, [teacherId]);

    console.log(classHR)

    const handleClassClick = (classId) => {
        setSelectedClass(classId); // Cập nhật lớp được chọn
    };

    const handleCardClick = (cardType) => {
        if (!selectedClass) return;  // Kiểm tra xem lớp đã được chọn chưa

        // Tìm lớp được chọn
        const selectedClassData = classes.find((classItem) => classItem._id === selectedClass);

        if (selectedClassData) {
            // Lọc danh sách môn học mà giáo viên đang dạy trong lớp đó
            const teacherSubjects = selectedClassData.subjectGroup.filter(
                (subject) => subject.teacherId === user.id
            );

            setSelectedCard(cardType);    // Lưu loại card đã bấm
            setSubjects(teacherSubjects); // Cập nhật danh sách môn học
            setIsModalOpen(true);         // Mở modal
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSubjects([]); // Reset danh sách môn học khi đóng modal
    };

    const goToManageScore = (idSubject) => {
        console.log(idSubject)
        navigate(`/manage/gradeTable/${idSubject}/${selectedClass}/1`)
    }

    const handleModalClick = (subjectId) => {
        if (selectedCard === "attendance") {
            navigate(`/attendance/${subjectId}`);
            // Hàm điều hướng hoặc xử lý cho Quản lí điểm danh
        } else if (selectedCard === "grade") {
            // Hàm điều hướng hoặc xử lý cho Bảng điểm
            navigate(`/manage/gradeTable/${subjectId}/${selectedClass}/1`)
        } else if (selectedCard === "homework") {
            // Hàm điều hướng hoặc xử lý cho Giao bài tập, tài liệu
            navigate(`/manage/teachingMaterial/${selectedClass}/${subjectId}`);
        } else if (selectedCard === "question") {
            // Hàm điều hướng hoặc xử lý cho Quản lí câu hỏi
            navigate(`/manage/questionManage/${selectedClass}/${subjectId}`)
        } else if (selectedCard === "evaluate") {
            navigate(`/manage/evaluateManage/${selectedClass}/${subjectId}`)
        }
    };

    const handleGoToManageAbsentRequest = (idClass) => {
        navigate(`/manage/addAbsenceRequest/${idClass}`)
    }

    const handleGoToProfileStudentInClass = (idClass) => {
        navigate(`/manage/profileStudentInClass/${idClass}`)
    }

    const handleGoToSendNotification = (idClass) => {
        navigate(`/manage/thrNotification/${idClass}`)
    }

    const handleGoToCalendar = () => {
        navigate('/manage/calender')
    }

    const handleGoToReport = () => {
        navigate('/manage/report')
    }

    const handleGoToSendNoti = () => {
        navigate('/manage/historySendNotification')
    }

    const handleGoToTimeTable = () => {
        navigate('/student/timeTable')
    }

    const handleGoToSelfLearning = () => {
        navigate('/student/selfLearning')
    }

    const handleGoToAttendanceStudent = () => {
        navigate('/student/attendaceStudent')
    }

    const handleGoToScoreTableStudent = () => {
        navigate('/manage/scoreTableStudent')
    }

    const handleGoToConductEvaluation = (idClass) => {
        navigate(`/manage/conductEvaluation/${idClass}`)
    }

    const handleGoToViewScoreInClassTHR = () => {

    }

    const handleGoToCreateCalendar = () => {
        navigate(`/manage/manageSchedule`)
    }

    const handleGoToCreateExamSchedule = () => {
        navigate(`/manage/examSchedule`)
    }

    const handleGoToClassDivision = () => {
        navigate(`/manage/classDivision`)
    }

    const handleGoToClassManage = () => {
        navigate(`/manage/manageClass`)
    }

    const handleGoToViewExamSchedule = () => {
        navigate(`/manage/student/viewExamSchedule`)
    }

    const handleGoToAutoCreateAccount = () => {
        navigate(`/manage/autoCreateAccount`)
    }

    const handleGoToManageAccount = () => {
        navigate(`/manage/manageAccount`)
    }

    // console.log(classHR && classHR.teacherHR !== null && classHR.teacherHR === user.id)

    return (
        <div className="flex flex-col p-6 bg-gray-100 min-h-screen">
            {/* Tabs for Class Selection */}
            <div className="flex space-x-4 mb-8">
                {classes.map((classItem) => (
                    <button
                        key={classItem._id}
                        onClick={() => handleClassClick(classItem._id)}
                        className={`px-4 py-2 text-gray-700 rounded-lg focus:outline-none 
                        ${selectedClass === classItem._id ? 'bg-blue-500 text-white ' : ''}`}
                    >
                        {classItem.nameClass}
                    </button>
                ))}
            </div>

            {/* Full-width Flex Container */}
            <div className="flex flex-col md:flex-row md:space-x-8 w-full">
                {/* Welcome Banner */}
                <div className="flex-1 bg-blue-500 text-white rounded-lg p-6 flex flex-col md:flex-row md:justify-around md:items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-2">Chào mừng tới Trường THPT Ông Ích Khiêm!</h2>
                        <p className="text-lg">Trang liên lạc và truyền thông nhà trường</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex justify-center md:justify-end">
                        <img src="/images/dashboard.png" alt="student" className="w-48 h-48" />
                    </div>
                </div>

                {/* Attendance Status Boxes */}
                <div className="grid grid-cols-2 gap-4 mt-8 md:mt-0 flex-4">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <h3 className="text-lg font-semibold">Đi học buổi chiều</h3>
                        <span className="text-2xl font-bold text-green-500">0</span>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <h3 className="text-lg font-semibold">Đi muộn buổi chiều</h3>
                        <span className="text-2xl font-bold text-orange-500">0</span>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <h3 className="text-lg font-semibold">Nghỉ CP buổi chiều</h3>
                        <span className="text-2xl font-bold text-blue-500">0</span>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <h3 className="text-lg font-semibold">Nghỉ KP buổi chiều</h3>
                        <span className="text-2xl font-bold text-red-500">0</span>
                    </div>
                </div>
            </div>
            {user.role === "Teacher" && (
                <div>
                    <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full mt-8">
                        {/* Header */}
                        <h2 className="text-xl font-bold mb-6">Quản lý - Nhập liệu</h2>

                        {/* Cards Container */}
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                            <div onClick={() => handleCardClick("attendance")} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-orange-400 p-4 rounded-full mb-2">
                                    <GrScorecard size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Quản lí điểm danh</p>
                            </div>

                            {/* Other Cards */}
                            <div onClick={() => handleCardClick("grade")} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-sky-400 p-4 rounded-full mb-2">
                                    <GrScorecard size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Bảng điểm</p>
                            </div>

                            <div onClick={() => handleCardClick("homework")} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-teal-400 p-4 rounded-full mb-2">
                                    <FaBook size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Giao bài tập, tài liệu</p>
                            </div>

                            <div onClick={() => handleCardClick("question")} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-red-400 p-4 rounded-full mb-2">
                                    <FaClipboardQuestion size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Quản lí câu hỏi</p>
                            </div>

                            <div onClick={() => handleCardClick("evaluate")} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-violet-400 p-4 rounded-full mb-2">
                                    <MdStars size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Đánh giá học sinh</p>
                            </div>
                        </div>
                    </div>
                    {classHR && classHR.teacherHR !== null && classHR.teacherHR === user.id && (
                        <div>
                            <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full mt-8">
                                <h2 className="text-xl font-bold mb-6">Quản lý lớp học</h2>
                                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                                    <div onClick={() => handleGoToManageAbsentRequest(classHR._id)} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                        <div className="bg-yellow-500 p-4 rounded-full mb-2">
                                            <TbSquareLetterA size={32} className="text-white" />
                                        </div>
                                        <p className="font-semibold">Quản lí đơn nghỉ học</p>
                                    </div>

                                    {/* Other Cards */}
                                    <div onClick={handleGoToViewScoreInClassTHR} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                        <div className="bg-green-400 p-4 rounded-full mb-2">
                                            <GrScorecard size={32} className="text-white" />
                                        </div>
                                        <p className="font-semibold">Điểm số</p>
                                    </div>

                                    <div onClick={() => handleGoToProfileStudentInClass(classHR._id)} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                        <div className="bg-pink-400 p-4 rounded-full mb-2">
                                            <FaClipboardUser size={32} className="text-white" />
                                        </div>
                                        <p className="font-semibold">Thông tin học sinh</p>
                                    </div>

                                    <div onClick={() => handleGoToSendNotification(classHR._id)} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                        <div className="bg-rose-500 p-4 rounded-full mb-2">
                                            <BiMailSend size={32} className="text-white" />
                                        </div>
                                        <p className="font-semibold">Gửi thông báo</p>
                                    </div>
                                    <div onClick={() => handleGoToConductEvaluation(classHR._id)} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                        <div className="bg-blue-400 p-4 rounded-full mb-2">
                                            <FaClipboardQuestion size={32} className="text-white" />
                                        </div>
                                        <p className="font-semibold">Hạnh kiểm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full mt-8">
                        <h2 className="text-xl font-bold mb-6">Tác vụ</h2>
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                            <div onClick={handleGoToCalendar} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-violet-400 p-4 rounded-full mb-2">
                                    <CalendarClock size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Lịch làm việc</p>
                            </div>

                            <div onClick={handleGoToSendNoti} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-lime-500 p-4 rounded-full mb-2">
                                    <BiMailSend size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Gửi thông báo</p>
                            </div>

                            {/* Other Cards */}
                            <div onClick={handleGoToReport} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-green-400 p-4 rounded-full mb-2">
                                    <GrScorecard size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Báo cáo</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {user.role === "User" && (
                <div>
                    <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full mt-8">
                        <h2 className="text-xl font-bold mb-6">Tác vụ</h2>
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                            <div onClick={handleGoToTimeTable} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-teal-400 p-4 rounded-full mb-2">
                                    <CalendarClock size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Thời khoá biểu</p>
                            </div>

                            <div onClick={handleGoToSelfLearning} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-orange-400 p-4 rounded-full mb-2">
                                    <BiMailSend size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Tự học</p>
                            </div>

                            {/* Other Cards */}
                            <div onClick={handleGoToAttendanceStudent} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-green-400 p-4 rounded-full mb-2">
                                    <GrScorecard size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Xem điểm danh</p>
                            </div>
                            <div onClick={handleGoToScoreTableStudent} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-green-400 p-4 rounded-full mb-2">
                                    <AiOutlineTrophy size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Xem điểm</p>
                            </div>
                            <div onClick={handleGoToViewExamSchedule} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-green-400 p-4 rounded-full mb-2">
                                    <AiOutlineTrophy size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Xem lịch thi</p>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {user.role === "Admin" && (
                <div>
                    <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full mt-8">
                        <h2 className="text-xl font-bold mb-6">Quản lý kế hoạch học tập</h2>
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                            <div onClick={handleGoToCreateCalendar} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-teal-400 p-4 rounded-full mb-2">
                                    <CalendarClock size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Tạo thời khoá biểu</p>
                            </div>

                            <div onClick={handleGoToCreateExamSchedule} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-orange-400 p-4 rounded-full mb-2">
                                    <AiOutlineSchedule size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Tạo lịch thi</p>
                            </div>

                            <div onClick={handleGoToSendNoti} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-emerald-400 p-4 rounded-full mb-2">
                                    <BiMailSend size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Gửi thông báo</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full mt-8">
                        <h2 className="text-xl font-bold mb-6">Quản lý</h2>
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                            {/* Other Cards */}
                            <div onClick={handleGoToClassDivision} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-green-400 p-4 rounded-full mb-2">
                                    <GrScorecard size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Chia lớp</p>
                            </div>
                            <div onClick={handleGoToClassManage} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-purple-400 p-4 rounded-full mb-2">
                                    <SiGoogleclassroom size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Quản lý lớp học</p>
                            </div>
                            <div onClick={handleGoToAutoCreateAccount} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-red-400 p-4 rounded-full mb-2">
                                    <FaUserPlus size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Tạo tài khoản học sinh</p>
                            </div>
                            <div onClick={handleGoToManageAccount} className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-full md:w-1/5 cursor-pointer">
                                <div className="bg-yellow-500 p-4 rounded-full mb-2">
                                    <MdAccountCircle size={32} className="text-white" />
                                </div>
                                <p className="font-semibold">Quản lý tài khoản</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Danh sách các môn bạn dạy</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {subjects.map((subject) => (
                                <button
                                    onClick={() => handleModalClick(subject._id)}
                                    key={subject._id}
                                    className="bg-gray-100 p-4 rounded-md shadow-md text-center"
                                >
                                    <p className="text-gray-700 font-semibold">{subject.nameSubject}</p>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;

