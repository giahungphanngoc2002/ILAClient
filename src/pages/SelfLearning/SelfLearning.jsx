import React, { useEffect, useState } from 'react';
import * as ClassService from "../../services/ClassService";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SelfLearning = () => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [userClass, setUserClass] = useState(null);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await ClassService.getAllClass();
                const userClassData = data.data.find(cls =>
                    cls.studentID.some(student => student._id === user.id)
                );
                if (userClassData) {
                    setUserClass(userClassData);
                } else {
                    console.error('User class not found');
                    setError('User class not found');
                }
            } catch (error) {
                setError('Error fetching schedule data');
                console.error('Error fetching schedule data:', error);
            }
        };
        fetchSchedule();
    }, [user.id]);

    const handleSelectSubject = (subjectName) => {
        setSelectedSubject(subjectName);
    };

    // Danh sách ảnh cho từng môn học
    const subjectImages = {
        'Toán': '/images/ToanHoc.jpg',
        'Ngữ Văn': '/images/VanHoc.jpg',
        'Vật Lý': '/images/VatLi.jpg',
        'Hóa': '/images/chemistry.jpg',
        'Âm Nhạc': '/images/AmNhac.jpg',
        // Thêm các môn học khác và ảnh tương ứng
    };

    // Nếu không có hình ảnh, ta hiển thị tên môn học
    const subjects = userClass?.subjects || [];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Chọn Môn Học Tự Học</h1>

            {/* Hiển thị danh sách các môn học */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {subjects.map((subject, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-lg shadow-lg text-center cursor-pointer transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-xl"
                        onClick={() => navigate('/student/selfLearning/quiz')}
                    >
                        {/* Hiển thị ảnh tương ứng hoặc ảnh mặc định */}
                        <div className="w-full h-32 flex items-center justify-center mb-4 bg-gray-100 rounded-md">
                            <img
                                src={subjectImages[subject.nameSubject] || '/images/default.jpg'}
                                alt={subject.nameSubject}
                                className="object-cover w-full h-full rounded-md"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700">{subject.nameSubject}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SelfLearning;
