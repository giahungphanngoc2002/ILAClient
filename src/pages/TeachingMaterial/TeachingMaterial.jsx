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
  }, [idClass, idSubject]);  // Chỉ gọi lại khi idClass hoặc idSubject thay đổi
  

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const newFile = {
        file: selectedFile,
        uploadDate: new Date(),
        size: selectedFile.size
      };
  
      try {
        // Gọi API addResourceToSubject để thêm file vào resource
        const linkResource = selectedFile.name;  // Sử dụng tên file làm linkResource
        await ClassService.addResourceToSubject(idClass, idSubject, linkResource);  // Gọi mutation để thêm tài nguyên
  
        // Cập nhật state sau khi upload thành công
        setFiles([...files, newFile]);
        setSelectedFile(null); 
        toast.success("Cập nhập file thành công!");
  
      } catch (error) {
        console.error("Error uploading file and updating resource:", error);
        toast.error("Cập nhập file thất bại.");
      }
    } else {
      toast.error("No file selected. Please choose a file to upload.");
    }
  };

  const handleDownload = (file) => {
    const url = URL.createObjectURL(file.file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.file.name);
    document.body.appendChild(link);
    link.click();
  };

  const handleDelete = (fileIndex) => {
    setFiles(files.filter((_, index) => index !== fileIndex));
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
      <tr key={index} className="border-b bg-white hover:bg-gray-100 transition-all">
        <td className="px-4 py-2 flex items-center">
          {getFileTypeIcon(file.file.name)}
          <span className="ml-2 text-gray-800 break-words">{file.file.name}</span>
        </td>
        <td className="px-4 py-2">{file.uploadDate.toLocaleDateString()}</td>
        <td className="px-4 py-2">{(file.size / 1024).toFixed(2)} KB</td>
        <td className="px-4 py-2">
          <button
            onClick={() => handleDownload(file)}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            <AiOutlineDownload />
          </button>
          <button
            onClick={() => handleDelete(index)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all ml-2"
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
