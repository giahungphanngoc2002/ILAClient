import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import * as NotificationService from "../../services/NotificationService";
import * as ClassService from "../../services/ClassService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
function ManageAbsentAplication() {

    const [selectedApplicationId, setSelectedApplicationId] = useState(null);

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [emails, setEmails] = useState([]);
    const [application, setApplication] = useState([]);
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Hàm gọi API và cập nhật state
        const fetchApplication = async () => {
            setIsLoading(true);
            try {
                const data = await ClassService.getAllApplicationByStatus();
                setApplication(data.applications); // Giả sử API trả về dữ liệu trong `data`
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }finally {
                setIsLoading(false); // Kết thúc loading
            }
        };

        fetchApplication();
    }, []);

    console.log("123", application)

    useEffect(() => {

        const fetchApplicaionDetail = async () => {
            if (selectedApplicationId) {
                setIsLoading(true);
                try {
                    
                    const data = await ClassService.getDetailApplicationAbsent(selectedApplicationId);

                    setSelectedApplication(data.application); // Giả sử API trả về dữ liệu trong `data`
                } catch (error) {
                    console.error("Failed to fetch notification details:", error);
                }finally {
                    setIsLoading(false);
                }
            }
        };

        fetchApplicaionDetail();
    }, [selectedApplicationId]);

    const filteredApplications = application?.filter((applicationn) =>
        applicationn?.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group emails by date in the format 'yyyy-mm-dd' and sort dates in descending order
    const groupedApplication = filteredApplications?.reduce((acc, applicationn) => {
        const day = new Date(applicationn.createdAt).toISOString().split('T')[0];
        if (!acc[day]) acc[day] = [];
        acc[day].push(applicationn);
        return acc;
    }, {});

    const sortedDays = Object.keys(groupedApplication).sort((a, b) =>
        new Date(b) - new Date(a)
    );

    const goToCreateNotification = () => {
        if (user.role === "Teacher") {
            navigate('/manage/notificationToStudent');
        } else if (user.role === "Admin") {
            navigate('/manage/notificationToSchool');
        }
    };

    const handleDelete = async (id) => {
        setIsLoading(true); // Bắt đầu loading
        try {
            // Gọi API để xóa application
            await ClassService.deleteApplication(id);

            // Cập nhật lại state để loại bỏ application đã xóa
            setApplication((prevApplications) =>
                prevApplications.filter((app) => app._id !== id)
            );

            setSelectedApplication(null); // Xóa chi tiết ứng dụng đang chọn
            setSelectedApplicationId(null); // Reset ID đã chọn
            toast.success("Đã xóa đơn nghỉ học thành công.");
        } catch (error) {
            console.error("Failed to delete application:", error);
            toast.error("Xóa đơn nghỉ học thất bại.");
        }finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const handleUpdate = async (id) => {
        setIsLoading(true); // Bắt đầu loading
        try {
            // Gọi API để xóa application
            await ClassService.updateApplication(id);

            // Cập nhật lại state để loại bỏ application đã xóa
            setApplication((prevApplications) =>
                prevApplications.filter((app) => app._id !== id)
            );

            setSelectedApplication(null); // Xóa chi tiết ứng dụng đang chọn
            setSelectedApplicationId(null); // Reset ID đã chọn
            toast.success("Đã xét duyệt nghỉ học thành công.");
        } catch (error) {
            console.error("Failed to delete application:", error);
            toast.error("Xóa đơn nghỉ học thất bại.");
        }finally {
            setIsLoading(false); // Kết thúc loading
        }
    };


    return (
        <div className="flex h-screen p-6">
            {/* Danh sách email */}
            <div className="bg-white w-1/3 border-r px-4 pb-4 overflow-y-auto h-full"
                style={{ borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px" }}
            >
                <div
                    className="sticky top-0 bg-white z-10 pt-4"
                    style={{
                        paddingBottom: "8px",
                    }}
                >
                    <div className="flex justify-between mb-2">
                        <h2 className="text-xl font-semibold">Lịch sử đơn nghỉ học</h2>
                        <button onClick={goToCreateNotification} className="bg-blue-500 p-3 rounded"><GoPlus className="text-white" size={20} /></button>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {isLoading ? (
                    <p className="text-center text-gray-500">Đang tải...</p>
                ) : (
                    <div className="space-y-2">
                        {sortedDays.length > 0 ? (
                            sortedDays.map((day) => (
                                <div key={day}>
                                    {/* Header for each day */}
                                    <div className="flex items-center rounded-lg py-2">
                                        <FaChevronDown className="text-gray-600 mx-2" />
                                        <p className="font-semibold text-gray-800 flex-grow m-0">
                                            {new Date(day).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        {groupedApplication[day].map((applicationn) => (
                                            <div
                                                key={applicationn._id}
                                                onClick={() => setSelectedApplicationId(applicationn._id)}
                                                className={`p-4 cursor-pointer rounded-lg shadow-sm border ${selectedApplicationId === applicationn._id
                                                    ? "bg-blue-100 border-blue-500"
                                                    : "bg-gray-50 border-gray-300"
                                                    } hover:bg-blue-50 transition duration-200`}
                                            >
                                                <div className="flex justify-between">
                                                    <p className="font-semibold text-gray-800">Phụ huynh của: {applicationn.studentId.name}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {new Date(applicationn.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 truncate">{applicationn.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full pt-10">
                                <img src="/images/nodata_icon.svg" alt="No data" className="mb-2" />
                                <p className="text-gray-500">Không có dữ liệu</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
    
            {/* Chi tiết email */}
            <div className="bg-white w-2/3 p-4 overflow-y-auto h-full"
                style={{ borderTopRightRadius: "16px", borderBottomRightRadius: "16px" }}
            >
                <div className="border-b">
                    <h2 className="text-xl font-semibold mb-4">Chi tiết thông báo</h2>
                </div>
                {isLoading ? (
                    <p className="text-gray-500">Đang tải chi tiết...</p>
                ) : selectedApplication ? (
                    <div>
                        <div className="border-b">
                            <h3 className="font-medium text-lg my-3">Thời gian Nghỉ</h3>
                            <p className="mb-4">{selectedApplication.dateOff}</p>
                        </div>
                        <div className="border-b">
                            <h3 className="font-medium text-lg my-3">Nội dung</h3>
                            <p className="mb-4">{selectedApplication.content}</p>
                        </div>
                        <h3 className="font-medium text-lg mb-2">Slot</h3>
                        <p className="mb-4">{selectedApplication.slot}</p>
                        <h3 className="font-medium text-lg mb-2">Trạng thái</h3>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
                            onClick={() => handleUpdate(selectedApplication._id)}
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đồng ý"}
                        </button>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
                            onClick={() => handleDelete(selectedApplication._id)}
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Từ chối"}
                        </button>
                    
                    </div>
                ) : (
                    <p className="text-gray-500">Chưa chọn thông báo</p>
                )}
            </div>
        </div>
    );
    
}

export default ManageAbsentAplication;
