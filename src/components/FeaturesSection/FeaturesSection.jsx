import React from "react";
import { FaLightbulb, FaUsers, FaPuzzlePiece } from "react-icons/fa"; // Import icon từ react-icons

const InfoSection = () => {
    return (
        <div className=" py-16 bg-gray-100">
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
                <div className="w-full md:w-1/2 pl-0 md:pl-12 mt-8 md:mt-0">
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <FaLightbulb className="text-yellow-500 text-2xl mr-3" />
                            <h3 className="text-xl font-semibold">Learn Anything Online</h3>
                        </div>
                        <p className="text-gray-600">
                            Suspendisse ante mi iaculis ac eleifend id venenatis non eros. Sed rhoncus gravida eli.
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <FaUsers className="text-yellow-500 text-2xl mr-3" />
                            <h3 className="text-xl font-semibold">Communicate People</h3>
                        </div>
                        <p className="text-gray-600">
                            Suspendisse ante mi iaculis ac eleifend id venenatis non eros. Sed rhoncus gravida eli eu sollicitudin sem iaculis.
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <FaPuzzlePiece className="text-yellow-500 text-2xl mr-3" />
                            <h3 className="text-xl font-semibold">Share Your Knowledge</h3>
                        </div>
                        <p className="text-gray-600">
                            Suspendisse ante mi iaculis ac eleifend id venenatis non eros. Sed rhoncus gravida.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoSection;
