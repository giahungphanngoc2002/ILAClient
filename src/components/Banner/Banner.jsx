import React from 'react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();

    const handleToSearchClass = () => {
        navigate(`/searchClass`);

    }

    return (
        <div className="relative h-[850px] bg-cover bg-center" style={{ backgroundImage: 'url(../images/homepage.jpg)' }}>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="container mx-auto h-full flex items-center justify-center">
                <div className="text-center text-white z-10">
                    <h1 className="text-5xl font-light mb-4">
                        Nền tảng Quản lý Giáo dục
                    </h1>
                    <h2 className="text-xl font-normal mb-6">Hỗ trợ quản lý đào tạo, dạy - học và đánh giá, kiểm tra trực tuyến <br /> dành cho các đơn vị giáo dục</h2>
                    {/* <button
                        className="bg-blue-600 text-xl text-white px-8 py-3 rounded-full inline-flex items-center"
                        onClick={handleToSearchClass}
                    >
                        Bắt đầu
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default Banner;
