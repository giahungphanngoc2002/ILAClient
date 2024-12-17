import React from 'react';
import { FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import { BsAward } from 'react-icons/bs';

const SummaryAttendanceAndAward = ({ countAbsent, achivement }) => {
    console.log("ben nay:", countAbsent)
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Chuyên Cần */}
                <div className="p-6 w-full md:w-1/2 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                        <FaCalendarAlt className="text-blue-600 w-6 h-6 mr-2" />
                        <span className="text-xl font-bold text-blue-600">CHUYÊN CẦN</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 flex-1 h-full">
                        <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center w-full md:w-1/2 min-h-[120px] h-full">
                            <span className="text-gray-700 font-semibold">Nghỉ có phép</span>
                            <div className="text-purple-600 text-3xl font-bold">{countAbsent?.totalExcused}</div>
                            <span className="text-gray-500">buổi</span>
                        </div>
                        <div className="bg-purple-100 rounded-lg p-4 flex flex-col items-center w-full md:w-1/2 min-h-[120px] h-full">
                            <span className="text-gray-700 font-semibold">Nghỉ không phép</span>
                            <div className="text-teal-600 text-3xl font-bold">{countAbsent?.totalAbsent}</div>
                            <span className="text-gray-500">buổi</span>
                        </div>
                    </div>
                </div>

                {/* Khen Thưởng và Danh Hiệu */}
                <div className="p-6 w-full md:w-1/2 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                        <FaTrophy className="text-blue-600 w-6 h-6 mr-2" />
                        <span className="text-xl font-bold text-blue-600">KHEN THƯỞNG VÀ DANH HIỆU</span>
                    </div>
                    <div className="flex flex-1 h-full">
                        <div className="bg-orange-100 rounded-l-lg p-4 flex items-center w-1/2 min-h-[120px] h-full">
                            <BsAward className="text-yellow-500 w-8 h-8 mr-4" />
                            <div>
                                <span className="text-gray-700 font-semibold">Danh hiệu</span>
                                <p className="text-gray-600 m-0">{achivement}</p>
                            </div>
                        </div>
                        <div className="bg-orange-100 rounded-r-lg p-4 flex items-center w-1/2 min-h-[120px] h-full">
                            <BsAward className="text-yellow-500 w-8 h-8 mr-4" />
                            <div>
                                <span className="text-gray-700 font-semibold">Khen thưởng thành tích đặc biệt</span>
                                <p className="text-gray-600 m-0">Không có</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryAttendanceAndAward;
