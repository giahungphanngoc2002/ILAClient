import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { FaSearch } from "react-icons/fa";
import * as ClassService from "../../services/ClassService";
import { useParams } from "react-router-dom";

const rows = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Lê Văn C" },
  { id: 4, name: "Phạm Thị D" },
  { id: 5, name: "Hoàng Văn E" },
  { id: 6, name: "Đỗ Thị F" },
  { id: 7, name: "Ngô Văn G" },
  { id: 8, name: "Bùi Thị H" },
  { id: 9, name: "Vũ Văn I" },
  { id: 10, name: "Đặng Thị J" },
];

function ConductEvaluation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("semester1");
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

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onBack = () => {
    window.history.back();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmitConductEvaluation = () => {
    console.log("Selected Semester:", selectedSemester);
  };

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
  };

  return (
    <div className="w-full h-screen flex flex-col p-6 bg-gray-100">
      <Breadcrumb
        title="Đánh giá hạnh kiểm"
        buttonText="Hoàn thành đánh giá"
        onSubmit={handleSubmitConductEvaluation}
        onBack={onBack}
      />

      <div className="pt-12"></div>

      <div className="bg-white mt-4 rounded-lg shadow-lg overflow-x-auto" style={{ maxWidth: "100%" }}>
        <div className="pt-3 pb-1 flex justify-between items-center px-4">
          {/* Search Input */}
          <div style={{width:"30%"}} className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên Học sinh"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-500"
            />
          </div>
          {/* Semester Selection Buttons */}
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${selectedSemester === "semester1" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => handleSemesterChange("semester1")}
            >
              Kỳ 1
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${selectedSemester === "semester2" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => handleSemesterChange("semester2")}
            >
              Kỳ 2
            </button>
          </div>
        </div>

        <div className="overflow-y-auto mt-2" style={{ maxHeight: "69vh" }}>
          <table className="min-w-full bg-white" style={{ borderCollapse: "separate", width: "100%", minWidth: "800px" }}>
            <thead>
              <tr>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    width: "10%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                    backgroundColor: "#007ACC",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    width: "45%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    backgroundColor: "#007ACC",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                  }}
                >
                  Tên
                </th>
                <th
                  className="text-center"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    width: "45%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    backgroundColor: "#007ACC",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                  }}
                >
                  Hạnh kiểm
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100 even:bg-gray-50">
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{row.id}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.name}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                    <select className="border border-blue-700 rounded-md p-1 focus:ring-2 focus:ring-blue-700 focus:border-blue-700">
                      <option value="tốt">Tốt</option>
                      <option value="khá">Khá</option>
                      <option value="trung bình">Trung bình</option>
                      <option value="kém">Kém</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredRows.length < 10 &&
                Array.from({ length: 10 - filteredRows.length }).map((_, index) => (
                  <tr key={`empty-${index}`} className="bg-white">
                    <td className="py-3 px-4 border text-gray-700 text-center">&nbsp;</td>
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

export default ConductEvaluation;
