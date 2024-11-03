import React, { useState } from 'react'

export default function FormReport() {
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [attachment, setAttachment] = useState(null);


    const handleSubmitReport = () => {

    }

    return (
        <div className='container mx-auto p-4'>


            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Tạo báo cáo mới</h2>
                <input
                    type="text"
                    placeholder="Tiêu đề báo cáo"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                    placeholder="Nội dung báo cáo"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                ></textarea>

                {/* Phần đính kèm file */}
                <input
                    type="file"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    onChange={(e) => setAttachment(e.target.files[0])} // Lưu file đính kèm vào state
                />

                <button
                    onClick={handleSubmitReport}
                    className="px-4 py-2 bg-green-500 text-white rounded">
                    Gửi báo cáo
                </button>
            </div>
        </div>
    )
}
