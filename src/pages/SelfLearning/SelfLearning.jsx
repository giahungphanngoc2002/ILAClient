import React, { useEffect, useState } from "react";
import * as ClassService from "../../services/ClassService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SelfLearning = () => {
    const [userClass, setUserClass] = useState(null);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await ClassService.getAllClass();
                const userClassData = data.data.find((cls) =>
                    cls.studentID.some((student) => student._id === user.id)
                );
                if (userClassData) {
                    setUserClass(userClassData);
                } else {
                    console.error("User class not found");
                    setError("User class not found");
                }
            } catch (error) {
                setError("Error fetching schedule data");
                console.error("Error fetching schedule data:", error);
            }
        };
        fetchSchedule();
    }, [user.id]);

    const subjects = userClass?.subjectGroup.SubjectsId || [];

    const subjectImages = {
        "Toán": "/images/ToanHoc.jpg",
        "Ngữ Văn": "/images/VanHoc.jpg",
        "Vật Lý": "/images/VatLi.jpg",
        "Hóa": "/images/chemistry.jpg",
        "Âm Nhạc": "/images/AmNhac.jpg",
        // Add more subjects if needed
    };

    const handleGoToQuiz = (idSubject) => {
        navigate(`/student/selfLearning/quiz/${idSubject}`)
    }

    console.log(subjects)

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            {/* Subjects Section */}
            <section className="container mx-auto px-6 pt-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Chọn Môn Học Tự Học
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map((subject, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"

                        >
                            <img
                                src={subjectImages[subject.nameSubject] || "/images/default.jpg"}
                                alt={subject.nameSubject}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {subject.nameSubject}
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    {/* Mô tả mẫu nếu không có dữ liệu mô tả */}
                                    Đây là môn học rất thú vị, hãy khám phá ngay!
                                </p>
                                <button
                                    onClick={() => handleGoToQuiz(subject._id)}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
                                    Học ngay
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SelfLearning;
