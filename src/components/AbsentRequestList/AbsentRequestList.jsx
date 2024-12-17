import React, { useEffect, useState } from "react";
import * as ClassService from "../../services/ClassService";

const AbsenceRequestList = ({ idClass, year, week, dayOfWeek, targetSlot, slot, date }) => {
    const [absenceRequests, setAbsenceRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    console.log(slot, date)

    useEffect(() => {
        console.log("Year:", year, "Week:", week, "Day of Week:", dayOfWeek, "Target Slot:", targetSlot);
    }, [year, week, dayOfWeek, targetSlot]);

    useEffect(() => {
        const fetchAbsenceRequests = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await ClassService.getDetailApplicationAbsentByIdClass(idClass);
                console.log(response.applications)
                console.log(filterRecords(response.applications, date, slot))
                if (response && Array.isArray(response.applications)) {
                    setAbsenceRequests(filterRecords(response.applications, date, slot));
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

    function filterRecords(records, dateInput, slotInput) {
        // Hàm giúp cắt chuỗi ngày từ dateOff thành mảng
        const parseDateOff = (dateOffStr) => {
            const dateArray = dateOffStr.split(',').map(date => new Date(date.trim()));
            console.log("Parsed dateOffArray:", dateArray); // Log mảng ngày đã được cắt
            return dateArray;
        };

        // Hàm kiểm tra xem ngày truyền vào có nằm trong dateOff hay không
        const isDateValid = (dateOff, dateInput) => {
            console.log("Checking if the dateInput exists in dateOffArray:", dateOff, dateInput);
            return dateOff.some(date => {
                const isValid = date.toISOString().split('T')[0] === dateInput; // so sánh ngày (YYYY-MM-DD)
                console.log(`Comparing ${date.toISOString().split('T')[0]} with ${dateInput}:`, isValid);
                return isValid;
            });
        };

        // Lọc mảng dựa trên điều kiện
        return records.filter(record => {
            console.log("Processing record:", record); // Log mỗi bản ghi trước khi lọc

            // Cắt ngày từ dateOff và kiểm tra
            const dateOffArray = parseDateOff(record.dateOff);

            // Kiểm tra ngày có hợp lệ và slot có trong slotInput
            const dateIsValid = isDateValid(dateOffArray, dateInput);
            console.log(`Is the date valid for this record?`, dateIsValid);

            console.log(record.slot)
            const isSlotValid = record.slot.some(slot => slot == slotInput);
            console.log(`Is the slot valid for this record?`, isSlotValid, slotInput);

            return dateIsValid && isSlotValid; // Lọc theo cả 2 điều kiện
        });
    }



    // Lọc các yêu cầu nghỉ học khớp với các điều kiện về năm, tuần, và tiết
    const filteredAbsenceRequests = absenceRequests.filter(request => {
        const requestWeek = parseInt(request?.week); // Lấy tuần từ request
        const requestYear = parseInt(request?.year); // Lấy năm từ request
        const requestSlot = request?.slot;

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