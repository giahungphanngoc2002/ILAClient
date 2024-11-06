import React from "react";

const AttendanceSummary = ({data}) => {


    return (
        <div className="bg-gray-50 py-4 flex justify-around text-center">
            <div className="w-1/4 border-r-[1px] border-solid border-gray-200">
                <p className="text-xl font-bold text-black">{data.total}</p>
                <p className="text-gray-600 m-0">Tổng số</p>
            </div>
            <div className="w-1/4 border-r-[1px] border-solid border-gray-200">
                <p className="text-xl font-bold text-blue-500">{data.present}</p>
                <p className="text-gray-600 m-0">Đi học</p>
            </div>
            <div className="w-1/4 border-r-[1px] border-solid border-gray-200">
                <p className="text-xl font-bold text-orange-500">{data.excused}</p>
                <p className="text-gray-600 m-0">Nghỉ CP</p>
            </div>
            <div className="w-1/4">
                <p className="text-xl font-bold text-red-500">{data.unexcused}</p>
                <p className="text-gray-600 m-0">Nghỉ KP</p>
            </div>
        </div>
    );
};

export default AttendanceSummary;
