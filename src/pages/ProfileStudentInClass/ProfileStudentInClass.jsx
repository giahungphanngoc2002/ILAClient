import React, { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { FaSearch } from "react-icons/fa";

const rows = [
  {
    id: 1, name: "Thái Quang Bình", cccd: "001092758273", phone: "0913290582", address: "123 Đường A, Quận 1",
    parent: { name: "Thái Văn Thành", cccd: "101092758273", phone: "0901234567", address: "123 Đường A, Quận 1" }
  },
  {
    id: 2, name: "Nguyễn Thị Mộng Thơ", cccd: "002837462739", phone: "0906448523", address: "456 Đường B, Quận 2",
    parent: { name: "Thái Văn Thành", cccd: "101092758273", phone: "0901234567", address: "123 Đường A, Quận 1" }
  },
  {
    id: 3, name: "Lê Quang Tuấn", cccd: "003948572739", phone: "0905227389", address: "789 Đường C, Quận 3",
    parent: { name: "Thái Văn Thành", cccd: "101092758273", phone: "0901234567", address: "123 Đường A, Quận 1" }
  },
  {
    id: 4, name: "Trần Thị Thanh Hà", cccd: "004826382902", phone: "0976280706", address: "101 Đường D, Quận 4",
    parent: { name: "Thái Văn Thành", cccd: "101092758273", phone: "0901234567", address: "123 Đường A, Quận 1" }
  },
  {
    id: 5, name: "Nguyễn Thị Thúy An", cccd: "005927384920", phone: "0905611298", address: "202 Đường E, Quận 5",
    parent: { name: "Thái Văn Thành", cccd: "101092758273", phone: "0901234567", address: "123 Đường A, Quận 1" }
  },
  {
    id: 6, name: "Phạm Văn Đức", cccd: "006827384939", phone: "0932738910", address: "303 Đường F, Quận 6",
    parent: { name: "Thái Văn Thành", cccd: "101092758273", phone: "0901234567", address: "123 Đường A, Quận 1" }
  },
  { id: 7, name: "Vũ Minh Tuấn", cccd: "007928473820", phone: "0926283749", address: "404 Đường G, Quận 7" },
  { id: 8, name: "Bùi Văn Phúc", cccd: "008028374920", phone: "0912384762", address: "505 Đường H, Quận 8" },
  { id: 9, name: "Hoàng Thị Thanh", cccd: "009129487363", phone: "0962738492", address: "606 Đường I, Quận 9" },
  { id: 10, name: "Đỗ Thị Lan", cccd: "010238476291", phone: "0952738491", address: "707 Đường J, Quận 10" },
  { id: 11, name: "Nguyễn Văn Long", cccd: "011283746591", phone: "0948273629", address: "808 Đường K, Quận 11" },
  { id: 12, name: "Trần Thị Ngọc Huyền", cccd: "012364827193", phone: "0932817364", address: "909 Đường L, Quận 12" },
  { id: 13, name: "Phan Thị Minh", cccd: "013492837465", phone: "0973827465", address: "1010 Đường M, Quận Tân Bình" },
];

function ProfileStudentInClass() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Học sinh");

  // Lọc danh sách dựa trên tab hiện tại
  const filteredRows = rows.filter(row => {
    if (activeTab === "Học sinh") {
      return row.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (activeTab === "Phụ huynh" && row.parent) {
      return row.parent.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  const handleSubmit = () => {
    // Xử lý khi nhấn lưu
  };

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
        onButtonClick={handleSubmit}
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
        <div className="mt-4 flex items-center border border-gray-300 rounded-md p-2 bg-white">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder={`Tìm kiếm theo tên ${activeTab}`}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full outline-none"
          />
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md" style={{
            borderCollapse: 'collapse',
            width: '100%',
            minWidth: '800px',
            minHeight: '400px', // Đặt chiều cao tối thiểu để giữ nguyên kích thước bảng
          }}>
            <thead>
              <tr>
                <th style={{ width: "2%", padding: '8px', border: '1px solid #ddd', textAlign: 'center', backgroundColor: '#f8f9fa' }}>ID</th>
                {activeTab === "Phụ huynh" && (
                  <th style={{ width: "20%", padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>Tên Học Sinh</th>
                )}
                <th style={{ width: "28%", padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>Tên</th>
                <th style={{ width: "15%", padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>CCCD</th>
                <th style={{ width: "15%", padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>Số điện thoại</th>
                <th style={{ width: "40%", padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-200 odd:bg-gray-100">
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{row.id}</td>
                  {activeTab === "Phụ huynh" && (
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.name}</td>
                  )}
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{activeTab === "Học sinh" ? row.name : row.parent.name}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{activeTab === "Học sinh" ? row.cccd : row.parent.cccd}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{activeTab === "Học sinh" ? row.phone : row.parent.phone}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{activeTab === "Học sinh" ? row.address : row.parent.address}</td>
                </tr>
              ))}
              {/* Thêm hàng trống nếu số lượng hàng hiện tại ít hơn 10 */}
              {filteredRows.length < 10 &&
                Array.from({ length: 10 - filteredRows.length }).map((_, index) => (
                  <tr key={`empty-${index}`} className="bg-white">
                    <td className="py-3 px-4 border text-gray-700 text-center">&nbsp;</td>
                    {activeTab === "Phụ huynh" && <td className="py-3 px-4 border text-gray-700">&nbsp;</td>}
                    <td className="py-3 px-4 border text-gray-700">&nbsp;</td>
                    <td className="py-3 px-4 border text-gray-700">&nbsp;</td>
                    <td className="py-3 px-4 border text-gray-700">&nbsp;</td>
                    <td className="py-3 px-4 border text-gray-700">&nbsp;</td>
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
