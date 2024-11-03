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

        // Tìm slot dựa vào slotId
        const targetSlot = schedulesData?.data?.slots?.find(slot => slot._id === idSlot);

        if (targetSlot) {
          // Lấy danh sách absentStudentId từ slot tương ứng
          const absentStudents = targetSlot.absentStudentId;
          setStudentsAbsent(absentStudents);

          // Lấy danh sách học sinh trong lớp (students)
          const studentsData = await ClassService.getStudentInClass(idClass);
          if (!studentsData || !studentsData.data) {
            setError('Class not found');
          } else {
            // Duyệt qua danh sách students và cập nhật trạng thái dựa vào danh sách absentStudent
            const updatedStudents = studentsData.data.map(student => {
              const isAbsent = absentStudents.some(absentStudent => absentStudent._id === student._id);
              return {
                ...student,
                status: !isAbsent // Nếu sinh viên có trong danh sách vắng mặt thì đặt status là false
              };
            });

            // Cập nhật danh sách sinh viên
            setStudents(updatedStudents);
            setIsInitialLoadComplete(true); // Đánh dấu đã tải xong dữ liệu
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

  console.log(" Students: ", students);
  console.log(" absstuden: ", studentsAbsent);


  const openModal = async (student) => {
    try {
      const scoresData = await ScoreSbujectService.getAllScoresBySubject(idSubject, idClass, semester, student._id);

      // Directly use the data response for the student's score details
      const studentScoreDetails = scoresData; // Since your data has the correct structure

      // Extract all scores from the scoreDetail response
      const allScores = studentScoreDetails?.scores || [];
      const scoreId = studentScoreDetails?._id || null; // Get scoreId from the correct scoreDetail

      const categorizedScores = {
        oralScore: allScores.filter(score => score.type === 'mieng').map(score => score.score),
        quizScore: allScores.filter(score => score.type === '15-minute').map(score => score.score),
        testScore: allScores.filter(score => score.type === '1 tiet').map(score => score.score),
        finalScore: allScores.find(score => score.type === 'final')?.score || '',
      };

      // Update the state with the student scores and scoreId
      setStudentScores({
        name: student.name,
        id: student._id,
        scoreId: scoreId, // Attach the correct scoreId for the student
        scores: categorizedScores,
      });

      // Display the modal after setting the scores
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setError(error.message || 'Error fetching scores. Please try again later.');

      // Fallback in case of error
      setStudentScores({
        name: student.name,
        id: student._id,
        scoreId: null, // No scoreId if an error occurs
        scores: {
          oralScore: [],
          quizScore: [],
          testScore: [],
          finalScore: '',
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
    setStudentScores(prevState => {
      const updatedScores = { ...prevState.scores };
      if (type === 'finalScore') {
        updatedScores.finalScore = value;
      } else {
        updatedScores[type][index] = value;
      }
      return { ...prevState, scores: updatedScores };
    });
  };

  const handleAddNewInput = (type) => {
    setStudentScores(prevState => {
      const updatedScores = { ...prevState.scores };
      if (type === 'finalScore') {
        return prevState;
      } else {
        updatedScores[type].push('');
      }
      return { ...prevState, scores: updatedScores };
    });
  };

  const handleBackSchedule = () => {
    navigate('/manage/calender');
  };


  const mutation = useMutation({
    mutationFn: async (newAbsentStudentIds) => {
      // Call the ScheduleService để gửi dữ liệu cập nhật absent students
      return ScheduleService.updateAbsentstudentId(idSchedule, idClass, idSlot, newAbsentStudentIds);
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
    const newAbsentStudentIds = students
      .filter(student => student.status === false)
      .map(student => ({
        id: student._id,
        absenceType: absenceTypes[student._id] || 'Unexcused' // Default to 'Unexcused' if not selected
      }));

    console.log("Inactive Student IDs with Absence Type:", newAbsentStudentIds);

    // Đảm bảo inactiveStudentIds là mảng
    if (!Array.isArray(newAbsentStudentIds)) {
      console.error("inactiveStudentIds is not an array:", newAbsentStudentIds);
      return;
    }

    // Gọi mutation để cập nhật danh sách học sinh vắng
    // mutation.mutate(newAbsentStudentIds);
  };


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
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Tên học sinh</th>
                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleAddNewInput('oralScore')}>
                        Điểm miệng
                      </th>
                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleAddNewInput('quizScore')}>
                        Điểm 15 phút
                      </th>
                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleAddNewInput('testScore')}>
                        Điểm 1 tiết
                      </th>
                      <th className="border px-4 py-2">Điểm cuối kì</th>
                    </tr>
                  </thead>
                  <tbody>
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
                          {studentScores.scores.oralScore?.map((score, index) => (
                            <input
                              key={index}
                              type="number"
                              value={score}
                              onChange={(e) => handleScoreChange('oralScore', index, e.target.value)}
                              className="w-full border rounded px-2 py-1"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="border px-4 py-2">
                        <div className="grid grid-cols-2 gap-2">
                          {studentScores.scores.quizScore?.map((score, index) => (
                            <input
                              key={index}
                              type="number"
                              value={score}
                              onChange={(e) => handleScoreChange('quizScore', index, e.target.value)}
                              className="w-full border rounded px-2 py-1"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="border px-4 py-2">
                        <div className="grid grid-cols-2 gap-2">
                          {studentScores.scores.testScore?.map((score, index) => (
                            <input
                              key={index}
                              type="number"
                              value={score}
                              onChange={(e) => handleScoreChange('testScore', index, e.target.value)}
                              className="w-full border rounded px-2 py-1"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          value={studentScores.scores.finalScore || ''}
                          onChange={(e) => handleScoreChange('finalScore', null, e.target.value)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                    </tr>
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
                    ...studentScores.scores.oralScore.map(score => ({ type: 'mieng', score })),
                    ...studentScores.scores.quizScore.map(score => ({ type: '15-minute', score })),
                    ...studentScores.scores.testScore.map(score => ({ type: '1 tiet', score })),
                    studentScores.scores.finalScore ? { type: 'final', score: studentScores.scores.finalScore } : null
                  ].filter(scoreItem => scoreItem && scoreItem.score), // Lọc bỏ các điểm rỗng hoặc không có giá trị
                  studentId: studentScores.id,
                  subjectId: idSubject,
                  classId: idClass
                };
                console.log("studentScores", studentScores.scoreId)

                try {
                  // Kiểm tra nếu đã có scoreId thì dùng updateScore, nếu chưa thì dùng createScore
                  let response;
                  if (studentScores.scoreId) {
                    // Nếu scoreId tồn tại, gọi updateScore
                    response = await ScoreSbujectService.updateScore(studentScores.scoreId, scoreData);
                    toast.success("Đã cập nhật điểm thành công!");
                    console.log('Score updated:', response);
                  } else {
                    // Nếu chưa có scoreId, gọi createScore
                    response = await ScoreSbujectService.createScore(scoreData);
                    toast.success("Đã khởi tạo điểm thành công!");
                    console.log('Score created:', response);
                  }

                  // Cập nhật danh sách sinh viên với dữ liệu điểm mới
                  const updatedStudents = students.map((user) =>
                    user._id === studentScores.id ? { ...user, score: response } : user
                  );
                  setStudents(updatedStudents);
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