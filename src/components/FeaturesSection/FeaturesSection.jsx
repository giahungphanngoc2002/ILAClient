import React from "react";
import { FaLightbulb, FaUsers, FaPuzzlePiece } from "react-icons/fa"; // Import icon từ react-icons

const InfoSection = () => {
    return (
        <div className="py-16">
            <div className="container flex flex-col md:flex-row items-center">
                {/* Cột bên trái: Hình ảnh */}
                <div className="w-full md:w-1/2">
                    <img
                        src="images/course-4.jpg"
                        alt="Working Man"
                        className="w-full h-auto"
                    />
                </div>

                {/* Cột bên phải: Nội dung */}
                <div className="w-full md:w-1/2 pl-0 md:pl-16 mt-8 md:mt-0"> {/* Increased padding */}
                    <div className="mb-12"> {/* Increased margin-bottom */}
                        <div className="flex items-center mb-3">
                            <FaLightbulb className="text-yellow-500 text-2xl mr-4" /> {/* Increased margin-right */}
                            <h3 className="text-xl font-semibold m-0">Học Mọi Thứ Trực Tuyến</h3>
                        </div>
                        <p className="text-gray-600">
                            Nền tảng cung cấp bài học cho mọi môn học từ tiểu học đến THPT, giúp bạn học dễ dàng và hiệu quả.
                        </p>
                    </div>

                    <div className="mb-12"> {/* Increased margin-bottom */}
                        <div className="flex items-center mb-3">
                            <FaUsers className="text-yellow-500 text-2xl mr-4" /> {/* Increased margin-right */}
                            <h3 className="text-xl font-semibold m-0">Kết Nối Học Tập</h3>
                        </div>
                        <p className="text-gray-600">
                            Tương tác với giáo viên và bạn bè, đặt câu hỏi và trao đổi kiến thức để cùng nhau tiến bộ.
                        </p>
                    </div>

                    <div className="mb-12"> {/* Increased margin-bottom */}
                        <div className="flex items-center mb-3">
                            <FaPuzzlePiece className="text-yellow-500 text-2xl mr-4" /> {/* Increased margin-right */}
                            <h3 className="text-xl font-semibold m-0">Chia Sẻ Kiến Thức Của Bạn</h3>
                        </div>
                        <p className="text-gray-600">
                            Học sinh có thể chia sẻ kinh nghiệm và bài học với bạn bè, cùng nhau nâng cao kết quả học tập.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoSection;
