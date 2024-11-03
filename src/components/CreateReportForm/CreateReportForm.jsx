// CreateReportForm.js
import React, { useState } from "react";

// Loại báo cáo
const reportTypes = [
  { id: 1, name: "Báo cáo học tập" },
  { id: 2, name: "Báo cáo nề nếp và kỷ luật" },
  { id: 3, name: "Báo cáo tình hình lớp chủ nhiệm" },
  { id: 4, name: "Báo cáo chuyên môn" },
  { id: 5, name: "Báo cáo hoạt động ngoại khóa và phong trào thi đua" },
  { id: 6, name: "Báo cáo các vấn đề đặc biệt" },
  { id: 7, name: "Báo cáo cơ sở vật chất và trang thiết bị" },
  { id: 8, name: "Báo cáo tổng kết năm học" },
];

const CreateReportForm = ({ onSubmit }) => {
  const [report, setReport] = useState({
    title: "",
    type: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Cập nhật trường dữ liệu của báo cáo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  // Xử lý sự kiện submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (report.title && report.content && report.type) {
      onSubmit({ ...report, status: "Đã gửi" });
      setReport({
        title: "",
        type: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Tạo Báo cáo</h3>
      <input
        type="text"
        name="title"
        placeholder="Tiêu đề báo cáo"
        value={report.title}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        name="type"
        value={report.type}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Chọn loại báo cáo</option>
        {reportTypes.map((type) => (
          <option key={type.id} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
      <textarea
        name="content"
        placeholder="Nội dung báo cáo"
        value={report.content}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
      ></textarea>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Gửi báo cáo
      </button>
    </form>
  );
};

export default CreateReportForm;
