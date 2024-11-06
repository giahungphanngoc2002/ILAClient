import React from "react";

const absenceRequests = [
    {
        id: 1,
        studentName: "Hoàng Thị Kim Thảo",
        absenceDate: "15/10/2024",
        reason: "Gia đình có việc quan trọng",
        parentName: "Hoàng Thị Hồng",
        submittedTime: "21h10, 15/10/2024"
    },
    {
        id: 2,
        studentName: "Nguyễn Văn Bình",
        absenceDate: "16/10/2024",
        reason: "Bị ốm",
        parentName: "Nguyễn Thị Lan",
        submittedTime: "08h30, 16/10/2024"
    },
    {
        id: 3,
        studentName: "Trần Thị Mai",
        absenceDate: "17/10/2024",
        reason: "Đi du lịch cùng gia đình",
        parentName: "Trần Văn Hùng",
        submittedTime: "19h45, 16/10/2024"
    },
    {
        id: 4,
        studentName: "Lê Quốc Anh",
        absenceDate: "18/10/2024",
        reason: "Tham gia cuộc thi thể thao",
        parentName: "Lê Văn Nam",
        submittedTime: "17h20, 17/10/2024"
    },
    {
        id: 5,
        studentName: "Phạm Thị Lan Hương",
        absenceDate: "19/10/2024",
        reason: "Bận việc gia đình",
        parentName: "Phạm Văn Bình",
        submittedTime: "12h50, 18/10/2024"
    }
];

const AbsenceRequestList = () => {
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
            <div className="overflow-y-auto h-full" >
                {absenceRequests.map((request) => (
                    <div key={request.id} className="p-4 mb-2 bg-white">
                        <div className="grid grid-cols-12 mb-2">
                            <div className="col-span-6 font-medium">
                                {request.id}. {request.studentName}
                            </div>
                        </div>
                        <div className="text-gray-700 mb-1">
                            Ngày xin nghỉ: <span className="font-semibold">{request.absenceDate}</span>
                        </div>
                        <div className="text-gray-700 mb-1">
                            Lý do: <span className="font-semibold">{request.reason}</span>
                        </div>
                        <div className="text-gray-700 mb-1">
                            Phụ huynh gửi: <span className="font-semibold">{request.parentName}</span>
                        </div>
                        <div className="text-gray-700">
                            Gửi lúc: <span className="font-semibold">{request.submittedTime}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default AbsenceRequestList;
