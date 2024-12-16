import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { format, getISOWeek } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useParams } from "react-router-dom";
import * as ClassService from "../../services/ClassService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
// Các dữ liệu mẫu cho học sinh

function RequestAbsentAplication() {
    const [title, setTitle] = useState("");
    const [reason, setReason] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [selectedPeriods, setSelectedPeriods] = useState([]); // State để lưu các tiết được chọn
    const [students, setStudents] = useState("");
    const { idClass } = useParams();
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [teacherId, setTeacherId] = useState(user?.id);

    useEffect(() => {
        setTeacherId(user?.id);
    }, [user]);

    useEffect(() => {
        const fetchStudentsinClass = async () => {
            setIsLoading(true);
            try {
                const response = await ClassService.getDetailClass(idClass);

                if (response && response.data) {
                    const { nameClass, studentID } = response.data;

                    // Giả sử `studentID` là mảng chứa id của học sinh. Bạn có thể tạo mẫu dữ liệu như sau:
                    const formattedStudents = studentID.map((studentId, index) => ({
                        id: studentId, // Sử dụng id từ studentID
                        name: studentId.name, // Bạn cần thay thế tên này nếu có API khác để lấy tên thực
                        class: nameClass // Đặt `class` bằng `nameClass`
                    }));

                    setStudents(formattedStudents); // Đổ dữ liệu học sinh đã format
                    setIsError(false);
                } else {
                    console.error('Unexpected API response structure', response);
                    setStudents([]);
                }
            } catch (error) {
                setIsError(true);
                console.error('Error fetching schedule data:', error);
                setStudents([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (idClass) {
            fetchStudentsinClass();
        }
    }, [idClass]);

    const handleFileChange = (e) => {
        // Handle file upload logic here
    };

    const handleSelectAllToggle = () => {
        // Handle select all logic here
    };

    const handleStudentToggle = (id) => {
        setSelectedStudent((prev) =>
            prev === id ? null : id
        );
    };

    const filteredStudents = Array.isArray(students)
        ? students.filter((student) =>
            student.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
            (classFilter ? student.class === classFilter : true)
        )
        : [];

    const handlePeriodToggle = (period) => {
        setSelectedPeriods((prev) =>
            prev.includes(period) ? prev.filter(p => p !== period) : [...prev, period]
        );
    };

    const handleSubmit = async () => {
        try {
            // Lấy thông tin tuần, năm và ngày nghỉ từ `dateRange`
            const formattedDates = dateRange.map(date => ({
                week: getISOWeek(date),
                year: format(date, 'yyyy'),
                dateOff: format(date, 'yyyy-MM-dd'),
            }));

            // Chuẩn bị dữ liệu theo đúng model
            const applicationData = {
                week: formattedDates[0]?.week.toString(), // Lấy tuần từ ngày bắt đầu
                year: formattedDates[0]?.year.toString(), // Lấy năm từ ngày bắt đầu
                dateOff: formattedDates.map(date => date.dateOff).join(', '), // Ghép ngày nghỉ thành chuỗi
                content: reason, // Nội dung lý do nghỉ học
                slot: selectedPeriods, // Danh sách tiết nghỉ
                studentId: selectedStudent, // ID học sinh
            };

            // const response = await ClassService.createApplication(idClass, applicationData);
            toast.success("Gửi Đơn Thành Công");
            // Thông báo cho người dùng khi thành công hoặc điều hướng
        } catch (error) {
            console.error("Failed to create application:", error);
            // Xử lý lỗi nếu cần
        }
    };

    const onBack = () => {
        window.history.back();
    };


    function getDatesBetween(startDate, endDate) {
        let dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    let result = getDatesBetween(dateRange[0], dateRange[1]);


    function getDateInfo(dateRange) {
        return dateRange.map(date => {
            const dayOfWeek = format(date, 'EEEE', { locale: vi });
            const weekOfYear = getISOWeek(date);
            const year = format(date, 'yyyy');

            return { day: dayOfWeek, week: weekOfYear, year: year };
        });
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-4xl  bg-white rounded-lg shadow">
                <Breadcrumb
                    title="Tạo đơn nghỉ học"
                    buttonText="Gửi đơn"
                    onButtonClick={handleSubmit}
                    onBack={onBack}
                />

                

                <div className="bg-gray-100 ">
                    <div className="flex gap-4 h-[calc(100vh-150px)]">
                        <div className="w-full bg-white p-4 rounded-lg shadow overflow-y-auto">
                            <label className="block font-medium mb-2">Phạm vi ngày nghỉ</label>
                            <DatePicker
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => setDateRange(update)}
                                isClearable
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                                placeholderText="Chọn phạm vi ngày nghỉ"
                            />

                            <label className="block font-medium mb-2">Chọn số tiết nghỉ</label>
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {[...Array(10)].map((_, index) => (
                                    <label key={index} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            value={index + 1}
                                            checked={selectedPeriods.includes(index + 1)}
                                            onChange={() => handlePeriodToggle(index + 1)}
                                        />
                                        Tiết {index + 1}
                                    </label>
                                ))}
                            </div>
                            <label className="block font-medium mb-2">Lý do nghỉ học</label>
                            <ReactQuill
                                value={reason}
                                onChange={setReason}
                                className="w-full h-40 mb-4 text-gray-800"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default RequestAbsentAplication;
