import React, { useEffect, useState } from 'react';
import Toggle from '../../components/Toggle/Toggle';
import { Modal, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import * as ClassService from "../../services/ClassService";
import * as AbsentStudentService from "../../services/AbsentStudentService";
import * as ScoreSbujectService from "../../services/ScoreSbujectService";
import * as ScheduleService from "../../services/ScheduleService";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { GrView } from "react-icons/gr";
import { toast } from "react-toastify";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentScores, setStudentScores] = useState(null);
  const [studentAbsent, setStudentAbsent] = useState([]);
  const [error, setError] = useState('');
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const navigate = useNavigate();
  const { idClass, idSchedule, idSlot, idSubject, semester } = useParams();

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
    const fetchAbsentStudents = async () => {
      try {
        const data = await ScheduleService.getAllAbsentStudentId(idClass, idSchedule, idSlot);
        const absentStudents = data?.data?.absentStudents || [];

        // Gộp thông tin học sinh và trạng thái vắng mặt vào nhau
        const updatedStudents = students.map(student => {
          const isAbsent = absentStudents.some(absent => absent._id === student._id);
          return {
            ...student,
            isAbsent,  // Dùng để biết trạng thái vắng mặt
            status: !isAbsent // Nếu vắng mặt thì status = false, nếu có mặt thì status = true
          };
        });

        setStudents(updatedStudents);
        setStudentAbsent(absentStudents);
      } catch (error) {
        console.error("Failed to fetch absent students:", error.message);
      }
    };

    if (!isInitialLoadComplete && students.length > 0) {
      fetchAbsentStudents();
      setIsInitialLoadComplete(true); // Đảm bảo chỉ gọi fetchAbsentStudents một lần
    }
  }, [idClass, idSchedule, idSlot, students.length, isInitialLoadComplete]);





  const toggleStatus = (id) => {
    const updatedStudents = students.map(student =>
      student._id === id ? { ...student, status: !student.status } : student
    );
    setStudents(updatedStudents);
  };
  



  const mutation = useMutation({
    mutationFn: (absentStudentIds) =>
      AbsentStudentService.createAbsentStudent({
        classId: idClass,
        scheduleId: idSchedule,
        slotId: idSlot,
        studentIds: absentStudentIds,
      }),
    onSuccess: () => {
      toast.success("Đã lưu danh sách học sinh vắng mặt thành công!");
    },
    onError: () => {
      toast.error("Lưu danh sách học sinh vắng mặt thất bại.");
    },
  });

  const saveStudents = () => {
    if (!idClass || !idSchedule || !idSlot) {
      console.error('Error: Missing required parameters');
      return;
    }
    const absentStudentIds = students
      .filter(student => !student.status && student._id) // Lọc các học sinh có status === false
      .map(student => student._id);

    if (absentStudentIds.length > 0) {
      mutation.mutate(absentStudentIds);
    }
  };


  const openModal = async (student) => {
    try {
      const scoresData = await ScoreSbujectService.getAllScoresBySubject(idSubject, idClass, semester, student._id);
      const categorizedScores = {
        oralScore: scoresData?.scoreDetailId?.scores?.filter(score => score.type === 'mieng')?.map(score => score.score) || [],
        quizScore: scoresData?.scoreDetailId?.scores?.filter(score => score.type === '15-minute')?.map(score => score.score) || [],
        testScore: scoresData?.scoreDetailId?.scores?.filter(score => score.type === '1 tiet')?.map(score => score.score) || [],
        finalScore: scoresData?.scoreDetailId?.scores?.find(score => score.type === 'final')?.score || '',
      };

      setStudentScores({
        name: student.name,
        id: student._id,
        scores: categorizedScores,
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setError(error.message || 'Error fetching scores. Please try again later.');
      setStudentScores({
        name: student.name,
        id: student._id,
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
    navigate('/teacher/calender');
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
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm danh</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xem</th>
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
                          {studentScores.scores.oralScore.map((score, index) => (
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
                          {studentScores.scores.quizScore.map((score, index) => (
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
                          {studentScores.scores.testScore.map((score, index) => (
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
              onClick={() => {
                const updatedStudents = students.map((user) =>
                  user.id === studentScores.id ? studentScores : user
                );
                setStudents(updatedStudents);
                closeModal();
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
