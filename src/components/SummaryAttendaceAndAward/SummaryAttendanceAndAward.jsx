import React from 'react';
import { FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import { BsAward } from 'react-icons/bs';

const SummaryAttendanceAndAward = () => {
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Chuyên Cần */}
                <div className="p-6 w-full md:w-1/2">
                    <div className="flex items-center mb-4">
                        <FaCalendarAlt className="text-blue-600 w-6 h-6 mr-2" />
                        <span className="text-xl font-bold text-blue-600">CHUYÊN CẦN</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center w-full md:w-1/2">
                            <span className="text-gray-700 font-semibold">Nghỉ có phép</span>
                            <div className="text-teal-600 text-3xl font-bold">1</div>
                            <span className="text-gray-500">buổi</span>
                        </div>
                        <div className="bg-purple-100 rounded-lg p-4 flex flex-col items-center w-full md:w-1/2">
                            <span className="text-gray-700 font-semibold">Nghỉ không phép</span>
                            <div className="text-purple-600 text-3xl font-bold">0</div>
                            <span className="text-gray-500">buổi</span>
                        </div>
                    </div>
                </div>

                {/* Khen Thưởng và Danh Hiệu */}
                <div className="p-6 w-full md:w-1/2">
                    <div className="flex items-center mb-4">
                        <FaTrophy className="text-blue-600 w-6 h-6 mr-2" />
                        <span className="text-xl font-bold text-blue-600">KHEN THƯỞNG VÀ DANH HIỆU</span>
                    </div>
                    <div className="flex">
                        <div className="bg-orange-100 rounded-l-lg p-4 flex items-center w-1/2">
                            <BsAward className="text-yellow-500 w-8 h-8 mr-4" />
                            <div>
                                <span className="text-gray-700 font-semibold">Danh hiệu</span>
                                <p className="text-gray-600">Học sinh giỏi</p>
                            </div>
                        </div>
                        <div className="bg-orange-100 rounded-r-lg p-4 flex items-center w-1/2">
                            <BsAward className="text-yellow-500 w-8 h-8 mr-4" />
                            <div>
                                <span className="text-gray-700 font-semibold">Khen thưởng thành tích đặc biệt</span>
                                <p className="text-gray-600">Không có</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryAttendanceAndAward;
