import React, { useState } from 'react';
import { FaFilePdf, FaFileImage, FaFilePowerpoint } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const DocumentList = () => {
    // Mảng môn học
    const subjects = [
        { id: 1, name: 'Toán học' },
        { id: 2, name: 'Vật lý' },
        { id: 3, name: 'Hóa học' },
        { id: 4, name: 'Sinh học' },
        { id: 5, name: 'Ngữ văn' },
        { id: 6, name: 'GDQP AN' },
        { id: 7, name: 'Địa lý' },
    ];

    // Mảng tài liệu của các môn học với thời gian upload
    const documents = {
        1: [
            { id: 1, name: "Lý thuyết toán học", type: "pdf", url: "/docs/math-theory.pdf", uploadTime: "02/01/2024" },
            { id: 2, name: "Bài tập toán học", type: "pdf", url: "/docs/math-exercise.pdf", uploadTime: "03/01/2024" },
            { id: 3, name: "Hình ảnh minh họa toán học", type: "image", url: "/images/math.jpg", uploadTime: "02/25/2024" },
            { id: 4, name: "Lý thuyết toán học", type: "pdf", url: "/docs/math-theory.pdf", uploadTime: "02/01/2024" },
            { id: 5, name: "Bài tập toán học", type: "pdf", url: "/docs/math-exercise.pdf", uploadTime: "03/01/2024" },
            { id: 6, name: "Hình ảnh minh họa toán học", type: "image", url: "/images/math.jpg", uploadTime: "02/25/2024" },
            { id: 7, name: "Lý thuyết toán học", type: "pdf", url: "/docs/math-theory.pdf", uploadTime: "02/01/2024" },
            { id: 8, name: "Bài tập toán học", type: "pdf", url: "/docs/math-exercise.pdf", uploadTime: "03/01/2024" },
            { id: 9, name: "Hình ảnh minh họa toán học", type: "image", url: "/images/math.jpg", uploadTime: "02/25/2024" },
            { id: 10, name: "Lý thuyết toán học", type: "pdf", url: "/docs/math-theory.pdf", uploadTime: "02/01/2024" },
            { id: 11, name: "Bài tập toán học", type: "pdf", url: "/docs/math-exercise.pdf", uploadTime: "03/01/2024" },
            { id: 12, name: "Hình ảnh minh họa toán học", type: "image", url: "/images/math.jpg", uploadTime: "02/25/2024" },
            { id: 13, name: "Lý thuyết toán học", type: "pdf", url: "/docs/math-theory.pdf", uploadTime: "02/01/2024" },
            { id: 14, name: "Bài tập toán học", type: "pdf", url: "/docs/math-exercise.pdf", uploadTime: "03/01/2024" },
            { id: 15, name: "Hình ảnh minh họa toán học", type: "image", url: "/images/math.jpg", uploadTime: "02/25/2024" },
            { id: 16, name: "Lý thuyết toán học", type: "pdf", url: "/docs/math-theory.pdf", uploadTime: "02/01/2024" },
        ],
        2: [
            { id: 1, name: "Lý thuyết vật lý", type: "pdf", url: "/docs/physics-theory.pdf", uploadTime: "01/20/2024" },
            { id: 2, name: "Bài tập vật lý", type: "ppt", url: "/docs/physics-exercise.pptx", uploadTime: "02/10/2024" },
        ],
        3: [
            { id: 1, name: "Lý thuyết hóa học", type: "pdf", url: "/docs/chemistry-theory.pdf", uploadTime: "01/15/2024" },
            { id: 2, name: "Bài tập hóa học", type: "image", url: "/images/chemistry.jpg", uploadTime: "02/05/2024" },
        ],
    };

    // State chọn môn học
    const [selectedSubject, setSelectedSubject] = useState(1);

    // Hàm render biểu tượng tài liệu
    const renderIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FaFilePdf className="text-red-600 text-xl" />;
            case 'image':
                return <FaFileImage className="text-blue-500 text-xl" />;
            case 'ppt':
                return <FaFilePowerpoint className="text-orange-500 text-xl" />;
            default:
                return <FaFilePdf className="text-gray-500 text-xl" />;
        }
    };

    const onBack = () => {
        window.history.back();
    }

    return (
        <div className="h-screen max-w-6xl mx-auto p-6 grid grid-cols-12 gap-4">
            <Breadcrumb
                title="Tài liệu học tập"
                onBack={onBack}
                displayButton={false}
            />
            {/* Navigation bên trái */}
            <div className="col-span-3 bg-white rounded-lg shadow-md mt-12 overflow-y-auto max-h-screen">
                <h2
                    style={{
                        borderTopLeftRadius: "0.5rem",
                        borderTopRightRadius: "0.5rem",
                        borderLeftRadius: "0",
                        borderRightRadius: "0"
                    }}
                    className="bg-blue-500 text-white text-xl font-bold mb-4 p-3">Danh mục môn học</h2>
                <ul className="p-0">
                    {subjects.map(subject => (
                        <li
                            key={subject.id}
                            style={{ fontSize: "18px" }}
                            className={`px-4 py-2 cursor-pointer border-b ${selectedSubject === subject.id ? 'border-l-[4px] border-l-blue-500 bg-white text-gray-800' : 'bg-white text-gray-800'}`}
                            onClick={() => setSelectedSubject(subject.id)}
                        >
                            {subject.name}
                        </li>
                    ))}
                </ul>
            </div>
    
            {/* Hiển thị danh sách tài liệu */}
            <div className="col-span-9 bg-white rounded-lg shadow-md mt-12 overflow-x-auto max-h-screen">
                <h2 className="text-xl font-bold mx-4 my-3">Tài liệu học tập</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">Tên tài liệu</th>
                                <th className="p-3 text-left">Loại</th>
                                <th className="p-3 text-left">Thời gian upload</th>
                                <th className="p-3 text-left">Tải về</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents[selectedSubject]?.map(doc => (
                                <tr key={doc.id} className="border-b">
                                    <td className="p-3">{doc.name}</td>
                                    <td className="p-3">{renderIcon(doc.type)}</td>
                                    <td className="p-3">{doc.uploadTime}</td>
                                    <td className="p-3">
                                        <a href={doc.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                            Tải xuống
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
    
};

export default DocumentList;
