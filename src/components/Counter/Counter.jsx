import React from "react";
import { CiUser } from "react-icons/ci";
import { FaBook } from "react-icons/fa";

const Counter = () => {
    return (
        <div className="bg-gray-100 py-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <CiUser className="text-3xl" />
                    <h2 className="text-3xl font-semibold">25890</h2>
                    <p className="text-gray-500">Người dùng</p>
                </div>
                <div className="flex flex-col items-center">
                    <CiUser className="text-3xl" />
                    <h2 className="text-3xl font-semibold">1560</h2>
                    <p className="text-gray-500">Class</p>
                </div>
                <div className="flex flex-col items-center">
                    <FaBook className="text-3xl" />
                    <h2 className="text-3xl font-semibold">21350</h2>
                    <p className="text-gray-500">Khoá học</p>
                </div>
                <div className="flex flex-col items-center">
                    <CiUser className="text-3xl" />
                    <h2 className="text-3xl font-semibold">128560</h2>
                    <p className="text-gray-500">Đánh giá</p>
                </div>
            </div>
        </div>
    );
};

export default Counter;
