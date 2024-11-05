import React, { useEffect, useState } from 'react';
import Toggle from '../../components/Toggle/Toggle';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import * as ClassService from "../../services/ClassService";
import * as ScoreSbujectService from "../../services/ScoreSbujectService";
import * as ScheduleService from "../../services/ScheduleService";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { GrView } from "react-icons/gr";
import { toast } from "react-toastify";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [studentsAbsent, setStudentsAbsent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentScores, setStudentScores] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { idClass, idSchedule, idSlot, idSubject, semester } = useParams();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [absenceTypes, setAbsenceTypes] = useState({});
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [semesterScores, setSemesterScores] = useState({
    1: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
    2: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' }
  });

  useEffect(() => {
    if (semesterScores[selectedSemester]) {
      setStudentScores((prev) => ({
        ...prev,
        scores: semesterScores[selectedSemester],
      }));
    }
  }, [selectedSemester, semesterScores]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await ClassService.getStudentInClass(idClass);
        if (!studentsData || !studentsData.data) {
          setError('Class not found');
        } else {
          setStudents(studentsData.data.map(student => ({ ...student, status: true })));
          setError('');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching students. Please try again later.');
      }
    };
    fetchData();
  }, [idClass]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy dữ liệu về lịch học (schedules)
        const schedulesData = await ScheduleService.getDetailScheduleById(idSchedule);
        console.log(schedulesData)
        // Tìm slot dựa vào slotId
        const targetSlot = schedulesData?.data?.slots?.find(slot => slot._id === idSlot);
        console.log(targetSlot)
        if (targetSlot) {
          // Lấy danh sách absentStudentId từ slot tương ứng
          const absentStudents = targetSlot.absentStudentId;
          setStudentsAbsent(absentStudents);

          // Lấy danh sách học sinh trong lớp (students)
          const studentsData = await ClassService.getStudentInClass(idClass);
          if (!studentsData || !studentsData.data) {
            setError('Class not found');
          } else {
            // Duyệt qua danh sách students và cập nhật trạng thái dựa vào danh sách absentStudents
            const updatedStudents = studentsData.data.map(student => {
              console.log(absentStudents)
              const absentInfo = absentStudents.find(absentStudent => absentStudent.studentId === student._id);
              console.log(absentInfo)
              return {
                ...student,
                status: !absentInfo, // Đặt `status` là false nếu học sinh có mặt trong `absentStudents`
                isExcused: absentInfo ? absentInfo.isExcused : false // Đặt `isExcused` dựa trên `absentInfo`
              };
            });

            // Cập nhật danh sách sinh viên
            setStudents(updatedStudents);
            setIsInitialLoadComplete(true); // Đánh dấu đã tải xong dữ liệu

            // Khởi tạo `absenceTypes` với giá trị ban đầu từ `absentStudents`
            const initialAbsenceTypes = {};
            absentStudents.forEach(absent => {
              initialAbsenceTypes[absent.studentId] = absent.isExcused ? 'Excused' : 'Unexcused';
            });
            setAbsenceTypes(initialAbsenceTypes);
          }
        } else {
          console.log(`Slot với ID ${idSlot} không được tìm thấy.`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      }
    };

    fetchData();
  }, [idClass, idSchedule, idSlot]);


  // Chạy khi students hoặc studentsAbsent thay đổi


  const toggleStatus = (id) => {
    setStudents((prevStudents) => {
      const updatedStudents = prevStudents.map(student =>
        student._id === id ? { ...student, status: !student.status } : student
      );
      console.log("Updated Students: ", updatedStudents);
      return updatedStudents;
    });


    setAbsenceTypes(prevTypes => ({
      ...prevTypes,
      [id]: prevTypes[id] || 'Unexcused'
    }));
  };

  const handleAbsenceTypeChange = (id, type) => {
    setAbsenceTypes(prevTypes => ({
      ...prevTypes,
      [id]: type
    }));
  };
  const processScores = (scoresData, semester) => {
    const allScoresData = scoresData || [];  // Nếu không có dữ liệu, sử dụng mảng rỗng
    const scoreId = allScoresData.length > 0 ? allScoresData[0]._id : null;

    // Phân loại điểm theo loại và học kỳ
    const categorizedScores = {
      diemThuongXuyen: allScoresData
        .flatMap(data => data.scores)
        .filter(score => score.type === 'thuongXuyen' && score.semester === semester)
        .map(score => score.score),
      diemGiuaKi: allScoresData
        .flatMap(data => data.scores)
        .filter(score => score.type === 'giuaKi' && score.semester === semester)
        .map(score => score.score),
      diemCuoiKi: allScoresData
        .flatMap(data => data.scores)
        .filter(score => score.type === 'cuoiKi' && score.semester === semester)
        .map(score => score.score)[0] || '',  // Nếu không có điểm cuối kỳ, mặc định là chuỗi rỗng
    };

    return { categorizedScores, scoreId };
  };


  const openModal = async (student) => {
    try {
      // Fetch scores for semester 1
      const scoresDataSemester1 = await ScoreSbujectService.getAllScoresBySubject(idSubject, idClass, 1, student._id);
      const semester1 = processScores(scoresDataSemester1, 1);

      // Try to fetch scores for semester 2, but handle any potential errors for semester 2 independently
      let semester2 = { categorizedScores: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' }, scoreId: null };
      try {
        const scoresDataSemester2 = await ScoreSbujectService.getAllScoresBySubject(idSubject, idClass, 2, student._id);
        semester2 = processScores(scoresDataSemester2, 2);
      } catch (error) {
        console.warn('Error fetching scores for semester 2:', error);
      }

      // Initialize semesterScores with the data that was successfully fetched
      setSemesterScores({
        1: semester1.categorizedScores,
        2: semester2.categorizedScores,
      });

      // Store scoreId per semester and set student scores
      setStudentScores({
        name: student.name,
        id: student._id,
        scoreIds: { 1: semester1.scoreId, 2: semester2.scoreId },
        scores: {
          1: semester1.categorizedScores,
          2: semester2.categorizedScores,
        },
      });

      setShowModal(true);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setError(error.message || 'Error fetching scores. Please try again later.');

      // Initialize with empty data if there's an error
      setSemesterScores({
        1: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
        2: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
      });

      setStudentScores({
        name: student.name,
        id: student._id,
        scoreIds: { 1: null, 2: null },
        scores: {
          1: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
          2: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
        },
      });

      setShowModal(true);
    }
  };





  const closeModal = () => {
    setShowModal(false);
    setStudentScores(null);
  };

  const handleScoreChange = (type, index, value) => {
    setSemesterScores((prevSemesterScores) => {
      const updatedScores = { ...prevSemesterScores[selectedSemester] };
      if (type === 'diemCuoiKi') {
        updatedScores.diemCuoiKi = value;
      } else {
        updatedScores[type][index] = value;
      }
      return {
        ...prevSemesterScores,
        [selectedSemester]: updatedScores,
      };
    });
  };

  const handleAddNewInput = (type) => {
    setSemesterScores((prevSemesterScores) => {
      const updatedScores = { ...prevSemesterScores[selectedSemester] };
      if (type !== 'diemCuoiKi') {
        updatedScores[type].push('');
      }
      return {
        ...prevSemesterScores,
        [selectedSemester]: updatedScores,
      };
    });
  };


  const handleBackSchedule = () => {
    navigate('/manage/calender');
  };


  const mutation = useMutation({
    mutationFn: async (newAbsentStudents) => {
      // Call the ScheduleService để gửi dữ liệu cập nhật absent students
      return ScheduleService.updateAbsentstudentId(idSchedule, idClass, idSlot, newAbsentStudents);
    },
    onSuccess: (data) => {
      // Display success toast và log dữ liệu đã cập nhật
      toast.success("Absent students updated successfully!");
      console.log("Absent students updated:", data);
    },
    onError: (error) => {
      // Hiển thị lỗi nếu có
      toast.error("Error updating absent students.");
      console.error("Error updating absent students:", error.message);
    },
  });

  const saveStudents = () => {
    const newAbsentStudents = students
      .filter(student => student.status === false) // Lọc học sinh vắng mặt
      .map(student => ({
        studentId: student._id, // Sử dụng studentId thay vì id
        isExcused: absenceTypes[student._id] === 'Excused' // Đặt isExcused dựa trên absenceTypes
      }));

    console.log("Inactive Student IDs with Absence Type:", newAbsentStudents);

    // Đảm bảo inactiveStudentIds là mảng
    if (!Array.isArray(newAbsentStudents)) {
      console.error("newAbsentStudents is not an array:", newAbsentStudents);
      return;
    }

    // Gọi mutation để cập nhật danh sách học sinh vắng
    mutation.mutate(newAbsentStudents);
  };


  console.log(studentScores)

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-500">Student Management</h2>
          </div>
          <table className="min-w-full bg-white table-auto">
            <thead>
              <tr>
                <th style={{ width: "5%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th style={{ width: "25%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th style={{ width: "20%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                <th style={{ width: "20%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm danh</th>
                <th style={{ width: "15%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th style={{ width: "15%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xem</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center font-semibold text-gray-800">
                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-4" />
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Toggle
                      isOn={student.status} // Dùng status để kiểm soát trạng thái của Toggle
                      handleToggle={() => toggleStatus(student._id)}
                      userId={student._id}
                      onColor="bg-green-500"
                      offColor="bg-red-500"
                      tooltipText={student.status ? (student.isAbsent ? 'Vắng mặt' : 'Đã điểm danh') : 'Chưa điểm danh'}
                    />


                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!student.status && (
                      <select
                        value={absenceTypes[student._id] || ""}
                        onChange={(e) => handleAbsenceTypeChange(student._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 bg-white"
                      >
                        <option value="Excused">Có phép</option>
                        <option value="Unexcused">Không phép</option>
                      </select>
                    )}
                  </td>


                  <td className="px-6 py-4 whitespace-nowrap">
                    <GrView
                      className="cursor-pointer"
                      onClick={() => openModal(student)}
                      title="Xem chi tiết"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between">
            <button
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition duration-300"
              onClick={handleBackSchedule}
            >
              <FaArrowLeft className="mr-2" /> Trở về
            </button>
            <button
              onClick={saveStudents}
              className="bg-green-600 text-white font-bold text-lg px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>

      {showModal && studentScores && (
        <Modal show={showModal} onHide={closeModal} size="xl">
          <Modal.Body>
            <div className="bg-gray-100 flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">Bảng Điểm Học Sinh</h2>
                <div className="flex justify-center mb-4">
                  <button
                    className={`px-4 py-2 font-semibold ${selectedSemester === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedSemester(1)}
                  >
                    Kỳ 1
                  </button>
                  <button
                    className={`px-4 py-2 font-semibold ${selectedSemester === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedSemester(2)}
                  >
                    Kỳ 2
                  </button>
                </div>
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Tên học sinh</th>
                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleAddNewInput('diemThuongXuyen')}>
                        Điểm thường xuyên
                      </th>
                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleAddNewInput('diemGiuaKi')}>
                        Điểm giữa kì
                      </th>
                      <th className="border px-4 py-2">Điểm cuối kì</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSemester === 1 ? (
                      <tr>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            name="name"
                            value={studentScores.name}
                            readOnly
                            className="w-full border rounded px-2 py-1 bg-gray-100"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <div className="grid grid-cols-2 gap-2">
                            {studentScores.scores.diemThuongXuyen?.map((score, index) => (
                              <input
                                key={index}
                                type="number"
                                value={score}
                                onChange={(e) => handleScoreChange('diemThuongXuyen', index, e.target.value)}
                                className="w-full border rounded px-2 py-1"
                              />
                            ))}
                          </div>
                        </td>
                        <td className="border px-4 py-2">
                          <div className="grid grid-cols-2 gap-2">
                            {studentScores.scores.diemGiuaKi?.map((score, index) => (
                              <input
                                key={index}
                                type="number"
                                value={score}
                                onChange={(e) => handleScoreChange('diemGiuaKi', index, e.target.value)}
                                className="w-full border rounded px-2 py-1"
                              />
                            ))}
                          </div>
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="number"
                            value={studentScores.scores.diemCuoiKi || ''}
                            onChange={(e) => handleScoreChange('diemCuoiKi', null, e.target.value)}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            name="name"
                            value={studentScores.name}
                            readOnly
                            className="w-full border rounded px-2 py-1 bg-gray-100"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <div className="grid grid-cols-2 gap-2">
                            {studentScores.scores.diemThuongXuyen?.map((score, index) => (
                              <input
                                key={index}
                                type="number"
                                value={score}
                                onChange={(e) => handleScoreChange('diemThuongXuyen', index, e.target.value)}
                                className="w-full border rounded px-2 py-1"
                              />
                            ))}
                          </div>
                        </td>
                        <td className="border px-4 py-2">
                          <div className="grid grid-cols-2 gap-2">
                            {studentScores.scores.diemGiuaKi?.map((score, index) => (
                              <input
                                key={index}
                                type="number"
                                value={score}
                                onChange={(e) => handleScoreChange('diemGiuaKi', index, e.target.value)}
                                className="w-full border rounded px-2 py-1"
                              />
                            ))}
                          </div>
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="number"
                            value={studentScores.scores.diemCuoiKi || ''}
                            onChange={(e) => handleScoreChange('diemCuoiKi', null, e.target.value)}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Tắt
            </Button>


            <Button
              variant="primary"
              onClick={async () => {
                const scoreData = {
                  scores: [
                    ...studentScores.scores.diemThuongXuyen.map(score => ({ type: 'thuongXuyen', score, semester: selectedSemester })),
                    ...studentScores.scores.diemGiuaKi.map(score => ({ type: 'giuaKi', score, semester: selectedSemester })),
                    studentScores.scores.diemCuoiKi ? { type: 'cuoiKi', score: studentScores.scores.diemCuoiKi, semester: selectedSemester } : null,
                  ].filter(scoreItem => scoreItem && scoreItem.score !== ''), // Ensure scores are valid
                  studentId: studentScores.id,
                  subjectId: idSubject,
                  classId: idClass,
                };
                console.log(scoreData)
                const currentScoreId = studentScores.scoreIds[selectedSemester];

                try {
                  let response;
                  if (currentScoreId) {
                    response = await ScoreSbujectService.updateScore(currentScoreId, scoreData);
                    toast.success("Đã cập nhật điểm thành công!");
                  } else {
                    response = await ScoreSbujectService.createScore(scoreData);
                    toast.success("Đã khởi tạo điểm thành công!");
                  }

                  // Update scoreId for the semester
                  setStudentScores((prev) => ({
                    ...prev,
                    scoreIds: {
                      ...prev.scoreIds,
                      [selectedSemester]: response._id, // Assuming response contains the new scoreId
                    },
                  }));

                  // Update semesterScores with saved data
                  setSemesterScores((prevSemesterScores) => ({
                    ...prevSemesterScores,
                    [selectedSemester]: studentScores.scores,
                  }));

                  closeModal();
                } catch (error) {
                  console.error("Error handling score:", error);
                }
              }}
            >
              Lưu
            </Button>

          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default StudentTable;