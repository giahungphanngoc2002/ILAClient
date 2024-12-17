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
    const [reason, setReason] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [selectedPeriods, setSelectedPeriods] = useState([]); // State để lưu các tiết được chọn
    const [students, setStudents] = useState("");
    const { idClass, idStudent } = useParams();
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


    const handlePeriodToggle = (period) => {
        setSelectedPeriods((prev) =>
            prev.includes(period) ? prev.filter(p => p !== period) : [...prev, period]
        );
    };

    const handleSubmit = async () => {
        try {
            // Chia từng ngày trong phạm vi
            const resultDates = getDatesBetween(startDate, endDate);

            // Lấy thông tin chi tiết về ngày, tuần và năm
            const dateInfo = resultDates.map(date => ({
                week: getISOWeek(date), // Tuần trong năm
                year: format(date, 'yyyy'), // Năm
                dateOff: format(date, 'yyyy-MM-dd') // Định dạng ngày nghỉ
            }));

            console.log("Processed Dates:", dateInfo); // Debug log

            // Tạo mảng dateOff chuẩn để gửi lên server
            const dateOffArray = dateInfo.map(info => info.dateOff);

            // Chuẩn bị dữ liệu application
            const applicationData = {
                week: dateInfo[0]?.week.toString(), // Lấy tuần từ ngày đầu tiên
                year: dateInfo[0]?.year.toString(), // Lấy năm từ ngày đầu tiên
                dateOff: dateOffArray.join(', '), // Ghép từng ngày lại thành chuỗi
                content: reason.replace(/^<p>|<\/p>$/g, ''), // Nội dung lý do nghỉ học
                slot: selectedPeriods, // Tiết học nghỉ
            };

            console.log("Final Data Sent:", applicationData); // Debug log

            // Gửi dữ liệu đến server
            const response = await ClassService.createApplicationByParent(idClass, idStudent, applicationData);
            toast.success("Gửi Đơn Thành Công");
        } catch (error) {
            console.error("Failed to create application:", error);
            toast.error("Gửi đơn thất bại!");
        }
    };


    const onBack = () => {
        window.history.back();
    };


    function getDatesBetween(startDate, endDate) {
        const dates = [];
        if (!startDate || !endDate) return dates;

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate)); // Push mỗi ngày vào mảng
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    let result = getDatesBetween(dateRange[0], dateRange[1]);
    console.log(result)

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
