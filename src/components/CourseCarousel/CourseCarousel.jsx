import React from "react";

const CourseCarousel = () => {
    const courses = [
        {
            title: "Toán học",
            price: "15",
            img: "images/hoc-toan.jpg",
            content: "Khóa học giúp học sinh phát triển tư duy logic, rèn luyện kỹ năng giải toán từ cơ bản đến nâng cao, phù hợp với mọi lứa tuổi. Chuẩn bị tốt cho các kỳ thi."
        },
        {
            title: "Văn học",
            price: "25",
            img: "images/van-hoc.png",
            content: "Khóa học Văn học giúp học sinh hiểu sâu về các tác phẩm, rèn luyện kỹ năng phân tích và đọc hiểu, hỗ trợ trong học tập và thi cử."
        },
        {
            title: "Anh văn",
            price: "80",
            img: "images/tieng-anh.jpg",
            content: "Khóa học tiếng Anh cung cấp kiến thức ngữ pháp, từ vựng và kỹ năng giao tiếp, giúp học sinh tự tin trong học tập và các kỳ thi quốc tế."
        }
    ];

    return (
        <div className="py-16 bg-gray-100 ">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center">Môn học</h2>
                <p className="text-gray-600 mb-12 text-center">Suspendisse ante mi iaculis ac eleifend id venenatis non eros.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
                            <img src={course.img} alt={course.title} className="w-full h-48 object-cover border-b-2" />
                            <div className="pt-3 px-4 flex-grow">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                                    <span className="text-yellow-500 text-xl font-semibold">{course.price} người</span>
                                </div>
                                <p className="text-gray-500 mt-2 mb-4 line-clamp-3">
                                    {course.content}
                                </p>
                            </div>
                            <div className="pt-2 px-4 pb-4">
                                <button className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
                                    Tham gia
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );


};

export default CourseCarousel;