import { FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaBell, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">Bảng Điều Khiển Tổng Quan</h1>
            {/* Section: Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Số lượng lớp dạy */}
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <FaChalkboardTeacher className="text-blue-500 text-4xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Lớp Dạy</h3>
                        <p className="text-xl font-bold">10</p>
                    </div>
                </div>

                {/* Số lượng học sinh */}
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <FaUserGraduate className="text-green-500 text-4xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Học Sinh</h3>
                        <p className="text-xl font-bold">250</p>
                    </div>
                </div>

                {/* Lịch trình */}
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <FaCalendarAlt className="text-yellow-500 text-4xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Lịch Trình</h3>
                        <p className="text-xl font-bold">4 Sự Kiện</p>
                    </div>
                </div>

                {/* Thông báo */}
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <FaBell className="text-red-500 text-4xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Thông Báo</h3>
                        <p className="text-xl font-bold">3</p>
                    </div>
                </div>
            </div>

            {/* Section: Reports and Activity Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Báo cáo nhanh */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Báo Cáo Nhanh</h3>
                    <div className="flex items-center mb-4">
                        <FaChartLine className="text-blue-500 text-3xl mr-4" />
                        <p className="text-lg">Tỷ lệ hoàn thành bài giảng: <span className="font-bold">85%</span></p>
                    </div>
                    <div className="flex items-center mb-4">
                        <FaChartLine className="text-green-500 text-3xl mr-4" />
                        <p className="text-lg">Tỷ lệ học sinh đạt yêu cầu: <span className="font-bold">90%</span></p>
                    </div>
                    <div className="flex items-center">
                        <FaChartLine className="text-yellow-500 text-3xl mr-4" />
                        <p className="text-lg">Tỷ lệ học sinh tham gia đầy đủ: <span className="font-bold">95%</span></p>
                    </div>
                </div>

                {/* Lịch trình giảng dạy */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Lịch Trình Giảng Dạy</h3>
                    <ul className="divide-y divide-gray-200">
                        <li className="py-2 flex justify-between">
                            <span>Buổi học Toán - Lớp 12A</span>
                            <span className="text-gray-500">08:00 AM - 10:00 AM</span>
                        </li>
                        <li className="py-2 flex justify-between">
                            <span>Buổi học Lý - Lớp 11B</span>
                            <span className="text-gray-500">10:30 AM - 12:00 PM</span>
                        </li>
                        <li className="py-2 flex justify-between">
                            <span>Buổi học Hóa - Lớp 12C</span>
                            <span className="text-gray-500">01:00 PM - 02:30 PM</span>
                        </li>
                        <li className="py-2 flex justify-between">
                            <span>Buổi học Văn - Lớp 10D</span>
                            <span className="text-gray-500">03:00 PM - 04:30 PM</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
