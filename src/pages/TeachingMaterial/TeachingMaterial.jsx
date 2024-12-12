import React, { useState, useEffect } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineDownload,
  AiOutlineDelete,
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileExcel,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import * as ClassService from "../../services/ClassService"; // Import the API service
import axios from "axios";
const getFileTypeIcon = (fileName) => {
  const extension = fileName.split('.').pop();
  switch (extension) {
    case 'pdf':
      return <AiOutlineFilePdf className="text-red-400" />;
    case 'docx':
      return <AiOutlineFileWord className="text-blue-400" />;
    case 'xlsx':
      return <AiOutlineFileExcel className="text-green-400" />;
    default:
      return <AiOutlineCloudUpload className="text-gray-400" />;
  }
};

const TeachingMaterial = () => {
  const [files, setFiles] = useState([]);  // Store the files (resources)
  const [selectedFile, setSelectedFile] = useState(null);
  const { idClass, idSubject } = useParams();  // Get the classId and subjectId from URL parameters
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        // Gọi API để lấy danh sách tài nguyên
        const response = await ClassService.getResourcesBySubject(idClass, idSubject);
  
        // Nhận danh sách tài nguyên từ response
        const resources = response.data;
  
        if (resources && Array.isArray(resources)) {
          // Map qua danh sách tài nguyên và chuẩn hóa dữ liệu cho từng file
          const loadedFiles = resources.map((resource) => ({
            fileId: resource._id,
            file: { name: resource.linkResource },  // Lấy tên file từ 'linkResource'
            uploadDate: new Date(resource.createdAt),  // Lấy ngày upload từ 'createdAt'
            size: resource.size  // Lấy kích thước file từ 'size'
          }));
  
          setFiles(loadedFiles);  // Cập nhật state với danh sách tài nguyên đã tải
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
        toast.error("Failed to load subject data.");
      }
    };
  
    fetchSubjectData();
  }, [idClass, idSubject]); 
  
  console.log(files)// Chỉ gọi lại khi idClass hoặc idSubject thay đổi
  

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("linkResource", selectedFile);
      console.log(selectedFile.size)
      // Kiểm tra nội dung FormData
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
  
      try {
        const response = await ClassService.addResourceToSubject(idClass,idSubject,selectedFile)
        console.log(response);  // Log phản hồi từ server
        setFiles([...files, { file: selectedFile, uploadDate: new Date(), size: selectedFile.size }]);
        setSelectedFile(null);
        toast.success("Cập nhập file thành công!");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Cập nhập file thất bại.");
      }
    } else {
      toast.error("No file selected. Please choose a file to upload.");
    }
  };
  
  
  
  

  const handleDownload = async (file) => {
    try {
      const response = await ClassService.downloadFileFromCloudinary(file.fileId)
  
      // Tạo URL blob từ dữ liệu nhận được
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // Lấy tên file và thêm phần mở rộng .pdf nếu cần
      const fileName = file.file.name.endsWith('.pdf') ? file.file.name : `${file.file.name}.pdf`;
  
      // Tạo liên kết để tải file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Đặt tên file tải xuống
      document.body.appendChild(link);
      link.click();
  
      // Giải phóng URL sau khi tải xong
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error.message);
      toast.error("Failed to download file.");
    }
  };
  
  
  
  
  
  
  

  const handleDelete = async (file, fileIndex) => {
    try {
      // Gửi yêu cầu xóa đến backend
      const response = await ClassService.deleteResourceToSubject(idClass, idSubject, file.fileId);
      if (response.success) {
        toast.success(response.message);
        // Xóa file khỏi state sau khi xóa thành công trên backend
        setFiles(files.filter((_, index) => index !== fileIndex));
      } else {
        toast.error("Failed to delete the resource.");
      }
    } catch (error) {
      console.error("Error deleting resource:", error.message);
      toast.error("Failed to delete the resource.");
    }
  };

  return (
    <div className="w-full h-screen p-8 bg-gray-50 shadow-lg font-openSans overflow-auto">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Tài liệu giảng dạy</h1>
      <div className="mb-4">
        <button
          onClick={() => navigate('/manage/myclass')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
        >
          <FaArrowLeft className="mr-2" /> Trở về
        </button>
      </div>

      {/* File Upload Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
            onChange={handleFileChange}
          />
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white flex items-center px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            <AiOutlineCloudUpload className="mr-2" /> Upload
          </button>
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: <span className="font-medium">{selectedFile.name}</span>
          </p>
        )}
        <p className="text-xs mt-1 text-gray-500">Supported formats: .pdf, .docx, .xlsx. Max size: 5MB.</p>
      </div>

      {/* File Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 text-left">File</th>
              <th className="px-4 py-2 text-left">Upload Date</th>
              <th className="px-4 py-2 text-left">Size</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6">
                  <div className="flex flex-col items-center justify-center h-[30vh]">
                    <AiOutlineCloudUpload className="text-gray-400 text-6xl" />
                    <p className="text-gray-500 mt-2">Chưa có tệp nào được tải lên. Bắt đầu bằng cách chọn tệp.</p>
                  </div>
                </td>
              </tr>
            ) : (
              files.map((file, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 flex items-center">
                    {getFileTypeIcon(file.file.name)}
                    <span className="ml-2">{file.file.name}</span>
                  </td>
                  <td className="px-4 py-2">{file.uploadDate.toLocaleDateString()}</td>
                  <td className="px-4 py-2">{(file.size / 1024).toFixed(2)} KB</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleDownload(file)}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                    >
                      <AiOutlineDownload />
                    </button>
                    <button
                     onClick={() => handleDelete(file, index)}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeachingMaterial;
