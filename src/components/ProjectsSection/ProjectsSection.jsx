import React from 'react';
import { FaMapPin } from 'react-icons/fa';

const ShareKnowledgeSection = () => {
    return (
        <div className="section-lg py-16 bg-gray-100 ">
            <div className="container mx-auto flex flex-col md:flex-row justify-between ">
                {/* Image Section */}
                <div className="md:w-1/2 order-2 md:order-1 mb-6 md:mb-0">
                    <img
                        className="w-full h-auto object-cover"
                        src="images/course-2.jpg"
                        alt="course"
                    />
                </div>

                {/* Text Section */}
                <div className="md:w-1/3 order-1 md:order-2">
                    <div className="mt-6">
                        <div className="fea-info">
                            <h4 className="text-2xl font-semibold mb-4">Sử dụng AI trong quá trình dạy và học</h4>
                            <p className="text-gray-600 mb-4">
                                Công nghệ AI đang cách mạng hóa việc học, giúp cá nhân hóa quá trình học tập và cung cấp nguồn kiến thức đa dạng. AI không chỉ tối ưu hóa việc tiếp thu kiến thức mà còn cải thiện kỹ năng tự học.
                            </p>
                            {/* <p className="text-gray-600">
                                Suspendisse ante mi iaculis ac Suspendisse ante mi iaculis ac eleifend id venenatis.
                            </p> */}
                        </div>
                        <ul className="list-none mt-4 space-y-4 p-0">
                            <li className="flex items-center">
                                <FaMapPin className="text-yellow-500 text-xl mr-2" />
                                <span className="text-gray-700">Cá nhân hóa học tập.</span>
                            </li>
                            <li className="flex items-center">
                                <FaMapPin className="text-yellow-500 text-xl mr-2" />
                                <span className="text-gray-700">Phân tích tiến trình.</span>
                            </li>
                            <li className="flex items-center">
                                <FaMapPin className="text-yellow-500 text-xl mr-2" />
                                <span className="text-gray-700">Học tập linh hoạt.</span>
                            </li>
                            <li className="flex items-center">
                                <FaMapPin className="text-yellow-500 text-xl mr-2" />
                                <span className="text-gray-700">Tương tác thông minh.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareKnowledgeSection;
