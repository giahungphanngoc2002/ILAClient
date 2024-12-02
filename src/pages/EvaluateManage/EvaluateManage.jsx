import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { FaSearch } from "react-icons/fa";
import * as ClassService from "../../services/ClassService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


function EvaluateManage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [conducts, setConducts] = useState(null);
  const { idClass, idSubject } = useParams();
  const [selectedSemester, setSelectedSemester] = useState("1"); // Mặc định Kỳ 1
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading


  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true); // Bắt đầu tải
        const response = await ClassService.getDetailClass(idClass);
        setStudents(response?.data?.studentID);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết lớp:", error);
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    if (idClass) {
      fetchClassDetails();
    }
  }, [idClass]);

  console.log(students)

  useEffect(() => {
    // Định nghĩa hàm bên trong useEffect để sử dụng
    const fetchConducts = async () => {
      try {
        setLoading(true);
        const response = await ClassService.getAllConductSemester(idClass, selectedSemester);
        setConducts(response); // Đảm bảo dữ liệu được đặt lại đúng
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    if (idClass) {
      fetchConducts();
    } // Gọi hàm fetchConducts để lấy dữ liệu mới
  }, [selectedSemester, idClass]);



  const mergedData = students.map((student) => {
    const conduct = conducts?.find(
      (cond) =>
        cond.studentId?._id === student?._id && cond?.semester === Number(selectedSemester) // Kiểm tra kỳ học
    );
    return {
      ...student,
      typeConduct: conduct ? conduct.typeConduct : "Chưa đánh giá", // Gắn giá trị mặc định nếu không có dữ liệu
    };
  });

  useEffect(() => {
    console.log("Dữ liệu conducts:", conducts);
  }, [conducts]);

  useEffect(() => {
    console.log("Dữ liệu students:", students);
  }, [students]);

  useEffect(() => {
    console.log("Kỳ học hiện tại:", selectedSemester);
  }, [selectedSemester]);

  console.log("Dữ liệu hiển thị:", mergedData);

  const filteredRows = mergedData.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onBack = () => {
    window.history.back();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmitConductEvaluation = async () => {
    try {
      const conductsForSelectedSemester = conducts?.filter(
        (conduct) => conduct.semester === Number(selectedSemester)
      );

      if (!conductsForSelectedSemester || conductsForSelectedSemester.length === 0) {
        // Nếu chưa có đánh giá cho kỳ hiện tại, khởi tạo mới
        const conductData = students.map((student) => {
          const conductSelect = document.querySelector(`#conduct-${student._id}`);
          return {
            typeConduct: conductSelect ? conductSelect.value : "tốt", // Giá trị mặc định là "tốt"
            semester: Number(selectedSemester), // Kỳ học (1 hoặc 2)
            studentId: student._id, // ID học sinh
          };
        });

        console.log("Conduct Data to Submit:", conductData);
        const response = await ClassService.createConduct(idClass, conductData);

        if (response) {
          toast.success("Khởi tạo đánh giá thành công!");
          // Cập nhật lại trạng thái sau khi khởi tạo
          const updatedConducts = await ClassService.getAllConductSemester(
            idClass,
            selectedSemester
          );
          setConducts(updatedConducts);
        }
      } else {
        // Nếu đã có đánh giá cho kỳ hiện tại, cập nhật từng mục
        const updatePromises = conductsForSelectedSemester.map(async (conduct) => {
          const conductSelect = document.querySelector(
            `#conduct-${conduct.studentId._id}`
          );
          const updatedTypeConduct = conductSelect
            ? conductSelect.value
            : conduct.typeConduct;

          const updateData = { typeConduct: updatedTypeConduct };
          return await ClassService.updateConduct(
            idClass,
            conduct._id,
            selectedSemester,
            updateData
          );
        });

        await Promise.all(updatePromises);
        toast.success("Cập nhật đánh giá thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi đánh giá hoặc cập nhật hạnh kiểm:", error);
      toast.error("Có lỗi xảy ra khi đánh giá hoặc cập nhật hạnh kiểm!");
    }
  };


  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
  };


  return (
    <div className="w-full h-screen flex flex-col p-6 bg-gray-100">
      <Breadcrumb
        title="Đánh giá học tập"
        buttonText="Hoàn thành đánh giá"
        onButtonClick={handleSubmitConductEvaluation}
        onBack={onBack}
      />

      <div className="pt-12"></div>

      <div className="bg-white mt-4 rounded-lg shadow-lg overflow-x-auto" style={{ maxWidth: "100%" }}>
        <div className="pt-3 pb-1 flex justify-between items-center px-4">
          {/* Search Input */}
          <div style={{ width: "30%" }} className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
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
              className={`px-4 py-2 rounded-lg font-semibold ${selectedSemester === "1" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => handleSemesterChange("1")}
            >
              Kỳ 1
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${selectedSemester === "2" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => handleSemesterChange("2")}
            >
              Kỳ 2
            </button>
          </div>
        </div>

        <div className="overflow-y-auto mt-2" style={{ maxHeight: "69vh" }}>
          {loading ? (
            <div className="text-center py-10">
              <span>Đang tải dữ liệu...</span>
            </div>
          ) : (
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
                {filteredRows.map((row, index) => (
                  <tr key={row._id} className="hover:bg-gray-100 even:bg-gray-50">
                    <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.name}</td>
                    <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                      <select
                        id={`conduct-${row._id}`}
                        className="border border-blue-700 rounded-md p-1 focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                        defaultValue={row.typeConduct}
                      >
                        <option value="Đạt">Đạt</option>
                        <option value="Không Đạt">Không Đạt</option>
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
          )}
        </div>

      </div>
    </div>
  );
}

export default EvaluateManage;