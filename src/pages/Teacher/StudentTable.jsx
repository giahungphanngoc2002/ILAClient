import React, { useEffect, useState } from 'react';
import Toggle from '../../components/Toggle/Toggle';
import { GrView } from "react-icons/gr";
import { Modal, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import * as ClassService from "../../services/ClassService";
import { useNavigate, useParams } from 'react-router-dom';

const StudentTable = () => {

  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { idClass } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await ClassService.getStudentInClass(idClass);
        setStudents(studentsData?.data.map(student => ({ ...student, status: true })));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchData();
  }, [idClass]);

  const toggleStatus = (id) => {
    const updatedStudents = students.map(student =>
      student._id === id ? { ...student, status: !student.status } : student
    );
    setStudents(updatedStudents);
    console.log("student Id", id)
  };

  const saveStudents = () => {
    const absentStudentIds = students
      .filter(student => !student.status)
      .map(student => student._id);

    console.log(absentStudentIds);
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleBackSchedule = () => {
    navigate('/teacher/calender')
  }

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
                <tr key={student.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center font-semibold text-gray-800">
                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-4" />
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Toggle
                      isOn={student.status}
                      handleToggle={() => toggleStatus(student._id)}
                      userId={student._id}
                      onColor="bg-green-500"
                      offColor="bg-red-500"
                      tooltipText={student.status ? 'Đã điểm danh' : 'Chưa điểm danh'}
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

      {selectedStudent && (
        <Modal show={showModal} onHide={closeModal} size="xl">
          {/* <Modal.Body>
            <div className="bg-gray-100 flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">Bảng Điểm Học Sinh</h2>
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Tên học sinh</th>
                      <th className="border px-4 py-2 cursor-pointer"
                        onClick={() => {
                          setSelectedUser({
                            ...selectedUser,
                            oralScore: [...selectedUser.oralScore, ''],
                          });
                        }}>
                        Điểm miệng
                      </th>
                      <th className="border px-4 py-2 cursor-pointer"
                        onClick={() => {
                          setSelectedUser({
                            ...selectedUser,
                            quizScore: [...selectedUser.quizScore, ''],
                          });
                        }}>
                        Điểm 15 phút
                      </th>
                      <th className="border px-4 py-2 cursor-pointer"
                        onClick={() => {
                          setSelectedUser({
                            ...selectedUser,
                            testScore: [...selectedUser.testScore, ''],
                          });
                        }}>
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
                          value={selectedUser.name}
                          readOnly
                          className="w-full border rounded px-2 py-1 bg-gray-100"
                          style={{ width: '250px' }}
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <div className="grid grid-cols-2 gap-2">
                          {selectedUser.oralScore.map((score, index) => (
                            <input
                              key={index}
                              type="text"
                              value={score}
                              onChange={(e) => {
                                const newScores = [...selectedUser.oralScore];
                                newScores[index] = e.target.value;
                                setSelectedUser({ ...selectedUser, oralScore: newScores });
                              }}
                              className="w-full border rounded px-2 py-1"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="border px-4 py-2">
                        <div className="grid grid-cols-2 gap-2">
                          {selectedUser.quizScore.map((score, index) => (
                            <input
                              key={index}
                              type="text"
                              value={score}
                              onChange={(e) => {
                                const newScores = [...selectedUser.quizScore];
                                newScores[index] = e.target.value;
                                setSelectedUser({ ...selectedUser, quizScore: newScores });
                              }}
                              className="w-full border rounded px-2 py-1"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="border px-4 py-2">
                        <div className="grid grid-cols-2 gap-2">
                          {selectedUser.testScore.map((score, index) => (
                            <input
                              key={index}
                              type="text"
                              value={score}
                              onChange={(e) => {
                                const newScores = [...selectedUser.testScore];
                                newScores[index] = e.target.value;
                                setSelectedUser({ ...selectedUser, testScore: newScores });
                              }}
                              className="w-full border rounded px-2 py-1"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          name="finalScore"
                          value={selectedUser.finalScore}
                          onChange={(e) => setSelectedUser({ ...selectedUser, finalScore: e.target.value })}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Modal.Body> */}
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Tắt
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const updatedStudents = students.map((student) => (student.id === selectedStudent.id ? selectedStudent : student));
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
