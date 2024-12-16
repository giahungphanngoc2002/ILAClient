import React, { useEffect, useState } from "react";
import * as ClassService from "../../services/ClassService";

const AbsenceRequestList = ({ idClass, year, week, dayOfWeek, targetSlot }) => {
    const [absenceRequests, setAbsenceRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        console.log("Year:", year, "Week:", week, "Day of Week:", dayOfWeek, "Target Slot:", targetSlot);
    }, [year, week, dayOfWeek, targetSlot]);

    useEffect(() => {
        const fetchAbsenceRequests = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await ClassService.getDetailApplicationAbsentByIdClass(idClass);
                console.log(response)
                if (response && Array.isArray(response.applications)) {
                    setAbsenceRequests(response.applications);
                } else {
                    console.error("Unexpected response format:", response);
                    setAbsenceRequests([]);
                }
            } catch (error) {
                console.error("Failed to fetch absence requests:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (idClass) {
            fetchAbsenceRequests();
        }
    }, [idClass]);
    console.log(absenceRequests)

    // Hàm để tính số tuần của một ngày nhất định

// Lọc các yêu cầu nghỉ học khớp với các điều kiện về ngày, tuần, và tiết
// Lọc các yêu cầu nghỉ học khớp với các điều kiện về năm, tuần, và tiết
const filteredAbsenceRequests = absenceRequests.filter(request => {
    const requestWeek = parseInt(request?.week); // Lấy tuần từ request
    const requestYear = parseInt(request?.year); // Lấy năm từ request
    const requestSlot = request?.slot;

    // console.log("Request Year:", requestYear);
    // console.log("Request Week:", requestWeek);
    // console.log("Expected Year:", year);
    // console.log("Expected Week:", week);
    // console.log("Expected DayOfWeek:", dayOfWeek);
    // console.log("Expected Slot Number:", targetSlot?.slotNumber);

    // So sánh năm, tuần, và slot để xác nhận yêu cầu nghỉ học
    return (
        requestYear === parseInt(year) && // So sánh năm
        requestWeek === parseInt(week) && // So sánh tuần
        requestSlot.includes(targetSlot?.slotNumber) // So sánh slot
    );
});

    

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading absence requests.</div>;
    }

    return (
        <div
            className="bg-white overflow-hidden"
            style={{
                borderRadius: "20px",
                borderLeft: "1px solid rgb(229, 231, 235)",
                borderRight: "1px solid rgb(229, 231, 235)",
                borderBottom: "1px solid rgb(229, 231, 235)",
                boxShadow: "rgb(213, 213, 213) 0px 0px 3px 0px"
            }}
        >
            <div className="sticky top-0 bg-white z-10 p-6">
                <h2 className="text-xl font-bold text-blue-500 m-0">Danh sách đơn nghỉ học</h2>
            </div>
            <div className="overflow-y-auto h-full">
                {filteredAbsenceRequests.length > 0 ? (
                    filteredAbsenceRequests.map((request, index) => (
                        <div key={request._id || index} className="p-4 mb-2 bg-white">
                            <div className="grid grid-cols-12 mb-2">
                                <div className="col-span-6 font-medium">
                                    {index + 1}. {request.studentId?.name || "Unknown"}
                                </div>
                            </div>
                            <div className="text-gray-700 mb-1">
                                Ngày xin nghỉ: <span className="font-semibold">{request.dateOff}</span>
                            </div>
                            <div className="text-gray-700 mb-1">
                                Tiết Nghỉ: <span className="font-semibold">{request.slot}</span>
                            </div>
                            <div className="text-gray-700 mb-1">
                                Lý do: <span className="font-semibold" dangerouslySetInnerHTML={{ __html: request.content }} />
                            </div>
                            <div className="text-gray-700">
                                Gửi lúc: <span className="font-semibold">{new Date(request.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-700 p-4">Không có yêu cầu nghỉ học nào phù hợp.</div>
                )}
            </div>
        </div>
    );
};

export default AbsenceRequestList;
