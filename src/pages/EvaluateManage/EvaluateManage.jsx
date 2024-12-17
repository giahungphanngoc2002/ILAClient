import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { FaSearch } from "react-icons/fa";
import * as ClassService from "../../services/ClassService";
import * as SubjectService from "../../services/SubjectService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


function EvaluateManage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [evaluates, setEvaluates] = useState(null);
  const { idClass, idSubject } = useParams();
  const [selectedSemester, setSelectedSemester] = useState(""); // Mặc định Kỳ 1
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [year, setYear] = useState("");
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true); // Bắt đầu tải
        const response = await ClassService.getDetailClass(idClass);
        setYear(response?.data?.year)
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

  useEffect(() => {
    const fetchYear = async () => {
      try {
        setLoading(true); // Bắt đầu tải
        const response = await SubjectService.getAllSemesterByYear(year);
        setSemesters(response?.semesters)
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết lớp:", error);
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };
    if (year) {
      fetchYear();
    }

  }, [year]);

  useEffect(() => {
    if (semesters.length > 0) {
      setSelectedSemester(semesters[0]._id); // Chọn kỳ đầu tiên
    }
  }, [semesters]);

  useEffect(() => {
    const fetchEvalutes = async () => {
      try {
        setLoading(true);
        const response = await SubjectService.getAllEvaluateSemester(idClass, idSubject, selectedSemester);
        setEvaluates(Array.isArray(response.data) ? response.data : []); // Ensure evaluates is an array
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    if (idClass) {
      fetchEvalutes();
    }
  }, [selectedSemester, idClass, idSubject]);




  const mergedData = students.map((student) => {
    const evaluate = Array.isArray(evaluates) ? evaluates.find(
      (cond) =>
        cond.StudentId?._id === student?._id && cond?.semester === selectedSemester
    ) : null;
    return {
      ...student,
      evaluate: evaluate ? evaluate.evaluate : "Chưa đánh giá", // Default value if no evaluation
    };
  });



  useEffect(() => {
  }, [evaluates]);


  useEffect(() => {
  }, [students]);

  useEffect(() => {
  }, [selectedSemester]);

  const filteredRows = mergedData.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onBack = () => {
    window.history.back();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmitEvaluateEvaluation = async () => {
    try {
      const evaluationsForSelectedSemester = evaluates?.data.filter(
        (evaluate) => evaluate.semester === selectedSemester
      )

      if (!evaluationsForSelectedSemester || evaluationsForSelectedSemester.length === 0) {

        const evaluateData = students.map((student) => {
          const evaluateSelect = document.querySelector(`#evaluate-${student._id}`);

          // Kiểm tra nếu thiếu trường dữ liệu
          if (!student._id || !idSubject || !idClass) {
            console.error(`Thiếu ID học sinh, môn học hoặc lớp học cho học sinh: ${student.name}`);
            toast.error("Các trường bắt buộc không hợp lệ!");
            return null; // Tránh gửi dữ liệu không hợp lệ
          }

          return {
            evaluate: evaluateSelect ? evaluateSelect.value : "Đạt",
            semester: selectedSemester, // Kỳ học
            StudentId: student._id, // ID học sinh
            subjectId: idSubject,   // ID môn học
            classId: idClass,       // ID lớp học
          };
        }).filter(Boolean); // Loại bỏ các giá trị null


        if (evaluateData.length > 0) {
          const response = await Promise.all(
            evaluateData.map(data =>
              SubjectService.createEvaluate(idClass, idSubject, data)));

          if (response) {
            toast.success("Khởi tạo đánh giá thành công!");
            // Refresh lại danh sách đánh giá sau khi khởi tạo
            const updatedEvaluates = await SubjectService.getAllEvaluateSemester(idClass, idSubject, selectedSemester);
            setEvaluates(updatedEvaluates);
          }
        }
      } else {
        // Nếu đã có đánh giá, cập nhật từng mục
        const updatePromises = evaluationsForSelectedSemester.map(async (evaluate) => {
          const evaluateSelect = document.querySelector(`#evaluate-${evaluate.StudentId._id}`);
          const updatedEvaluate = evaluateSelect ? evaluateSelect.value : evaluate.evaluate;

          const updateData = { evaluate: updatedEvaluate };

          // Kiểm tra các giá trị bắt buộc
          if (!evaluate.StudentId._id || !idSubject || !idClass) {
            console.error(`Thiếu ID học sinh, môn học hoặc lớp học cho đánh giá của học sinh: ${evaluate.StudentId.name}`);
            toast.error("Các trường bắt buộc không hợp lệ!");
            return;
          }

          return await SubjectService.updateEvaluate(
            idClass,
            idSubject,
            evaluate._id,
            selectedSemester,
            updateData
          );
        });

        await Promise.all(updatePromises);
        toast.success("Cập nhật đánh giá thành công!");
      }
    } catch (error) {
      console.error("Error when evaluating or updating evaluation:", error);
      toast.error("Có lỗi xảy ra khi đánh giá hoặc cập nhật đánh giá!");
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
        onButtonClick={handleSubmitEvaluateEvaluation}
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
            {semesters.map((semester) => (
              <button
                className={`px-4 py-2 rounded-lg font-semibold ${selectedSemester === semester._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => handleSemesterChange(semester._id)}
              >
                Kỳ {semester.nameSemester}
              </button>
            ))}
            {/* <button
              className={`px-4 py-2 rounded-lg font-semibold ${selectedSemester === "2" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => handleSemesterChange("2")}
            >
              Kỳ 2
            </button> */}
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
                    Đánh Giá
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
                        id={`evaluate-${row._id}`}
                        className="border border-blue-700 rounded-md p-1 focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                        defaultValue={row.evaluate}
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