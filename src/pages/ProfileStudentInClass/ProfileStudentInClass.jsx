import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { FaSearch } from "react-icons/fa";
import * as ClassService from "../../services/ClassService";
import { useParams } from "react-router-dom";

function ProfileStudentInClass() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Học sinh");
  const [classDetail, setClassDetail] = useState(null);
  const { idClass } = useParams();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await ClassService.getDetailClass(idClass);
        setClassDetail(response?.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết lớp:", error);
      }
    };

    if (idClass) {
      fetchClassDetails();
    }
  }, [idClass]);

  // console.log(classDetail)


  // Lọc dữ liệu theo tab và searchTerm
  const filteredRows = classDetail?.studentID?.flatMap(student => {
    if (activeTab === "Học sinh") {
      // Lọc danh sách học sinh
      return student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ? [student] : [];
    } else if (activeTab === "Phụ huynh" && student.infoContactId?.length) {
      console.log("da vao")
      // Lọc danh sách phụ huynh từ infoContact
      return student.infoContactId
        .filter(contact =>
          contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(contact => ({
          ...contact,
          relatedStudentName: student.name, // Lưu tên học sinh liên quan
        }));
    }
    return [];
  }) || [];


  console.log(filteredRows)




  const onBack = () => {
    window.history.back();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  return (
    <div className="w-full h-screen flex flex-col p-6">
      <Breadcrumb
        title="Quản lí học sinh trong lớp"
        buttonText="Lưu đơn"
        displayButton={false}
        onBack={onBack}
      />

      <div className="flex space-x-4 mt-8">
        <button
          onClick={() => handleTabChange("Học sinh")}
          className={`px-4 py-2 text-sm font-semibold ${activeTab === "Học sinh" ? "text-blue-500 border-b-2 border-blue-500" : ""}`}
        >
          Học sinh
        </button>
        <button
          onClick={() => handleTabChange("Phụ huynh")}
          className={`px-4 py-2 text-sm font-semibold ${activeTab === "Phụ huynh" ? "text-blue-500 border-b-2 border-blue-500" : ""}`}
        >
          Phụ huynh
        </button>
      </div>

      <div className="bg-white mt-1 rounded-lg overflow-x-auto" style={{ maxWidth: '100%' }}>
        <div
          className="mt-4 flex items-center border border-gray-300 rounded-md p-2 bg-white"
          style={{ position: 'sticky', top: 0, zIndex: 10 }}
        >
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder={`Tìm kiếm theo tên ${activeTab}`}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full outline-none"
          />
        </div>

        <div className="overflow-y-auto mt-4" style={{ maxHeight: '66vh' }}>
          <table className="min-w-full bg-white" style={{ borderCollapse: 'separate', width: '100%', minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={{ position: 'sticky', top: 0, zIndex: 10, padding: '8px', border: '1px solid #ddd', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                  ID
                </th>
                <th style={{ position: 'sticky', top: 0, zIndex: 10,padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                  Tên
                </th>
                <th style={{ position: 'sticky', top: 0, zIndex: 10, padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                  CCCD
                </th>
                <th style={{ position: 'sticky', top: 0, zIndex: 10, padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                  Số điện thoại
                </th>
                <th style={{ position: 'sticky', top: 0, zIndex: 10, padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                  Địa chỉ
                </th>
                {activeTab === "Phụ huynh" && (
                  <th style={{ position: 'sticky', top: 0, zIndex: 10, padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                    Tên Học Sinh
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-gray-200 odd:bg-gray-100">
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {activeTab === "Học sinh" ? item.name : item.name}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {activeTab === "Học sinh" ? item.cccd : item.cccd}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {activeTab === "Học sinh" ? item.phone : item.phone}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {activeTab === "Học sinh" ? item.address : item.address}
                  </td>
                  {activeTab === "Phụ huynh" && (
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.relatedStudentName}</td>
                  )}
                </tr>
              ))}
              {filteredRows.length < 10 &&
                Array.from({ length: 10 - filteredRows.length }).map((_, index) => (
                  <tr key={`empty-${index}`} className="bg-white">
                    <td className="py-3 px-4 border text-gray-700 text-center">&nbsp;</td>
                    <td className="py-3 px-4 border text-gray-700">&nbsp;</td>
                    <td className="py-3 px-4 border text-gray-700">&nbsp;</td>
                    <td className="py-3 px-4 border text-gray-700">&nbsp;</td>
                    <td className="py-3 px-4 border text-gray-700">&nbsp;</td>
                    {activeTab === "Phụ huynh" && <td className="py-3 px-4 border text-gray-700">&nbsp;</td>}
                  </tr>
                ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfileStudentInClass;
