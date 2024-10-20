import React, { useState } from 'react';

// Danh sách các môn học kèm theo ảnh từ mạng
const subjects = [
    {
        name: 'Toán học',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Hình ảnh Toán học
    },
    {
        name: 'Vật lý',
        image: 'https://images.unsplash.com/photo-1581091012184-7f35469b8329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Hình ảnh Vật lý
    },
    {
        name: 'Hóa học',
        image: 'https://images.unsplash.com/photo-1581093588401-7162a178a4b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Hình ảnh Hóa học
    },
    {
        name: 'Sinh học',
        image: 'https://images.unsplash.com/photo-1552845683-b6d95a48e0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Hình ảnh Sinh học
    },
    {
        name: 'Lịch sử',
        image: 'https://images.unsplash.com/photo-1554731617-45260a2563f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Hình ảnh Lịch sử
    },
    {
        name: 'Địa lý',
        image: 'https://images.unsplash.com/photo-1507120410856-1f35574c3b45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Hình ảnh Địa lý
    },
    {
        name: 'Ngữ văn',
        image: 'https://images.unsplash.com/photo-1517964603305-611b54f68947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Hình ảnh Ngữ văn
    },
    {
        name: 'Tiếng Anh',
        image: 'https://images.unsplash.com/photo-1511974035430-5de47d3b95da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // Hình ảnh Tiếng Anh
    },
];

const SelfLearning = () => {
    // State để lưu môn học được chọn
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Hàm xử lý khi chọn một môn học
    const handleSelectSubject = (subject) => {
        setSelectedSubject(subject);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Chọn Môn Học Tự Học</h1>

            {/* Hiển thị danh sách các môn học */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {subjects.map((subject, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-lg shadow-lg text-center cursor-pointer transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-xl"
                        onClick={() => handleSelectSubject(subject.name)}
                    >
                        {/* Hình ảnh môn học */}
                        <img 
                            src={subject.image} 
                            alt={subject.name} 
                            className="w-full h-32 object-cover mb-4 rounded-md transition-opacity duration-300 hover:opacity-80"
                        />
                        <h3 className="text-lg font-semibold text-gray-700">{subject.name}</h3>
                    </div>
                ))}
            </div>

            {/* Hiển thị thông báo môn học được chọn */}
            {selectedSubject && (
                <div className="mt-6 text-center">
                    <p className="text-xl text-blue-700 font-bold">
                        Bạn đã chọn môn học: {selectedSubject}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SelfLearning;
