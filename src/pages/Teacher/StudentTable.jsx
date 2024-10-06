import React, { useState } from 'react';
import Toggle from '../../components/Toggle/Toggle';
import { GrView } from "react-icons/gr";
import { Modal, Button } from 'react-bootstrap';

const StudentTable = () => {
  const initialUsers = [
    { id: 1, name: 'Michael Holz', date: '04/10/2013', role: 'Admin', status: true, avatar: '/images/trainer-1.jpg', oralScore: [8.5, 6], quizScore: [7, 9.8], testScore: [9], finalScore: 8.5 },
    { id: 2, name: 'Paula Wilson', date: '05/08/2014', role: 'Publisher', status: true, avatar: '/images/trainer-2.jpg', oralScore: [7], quizScore: [6.5], testScore: [8], finalScore: 7.5 },
    { id: 3, name: 'Antonio Moreno', date: '11/05/2015', role: 'Publisher', status: true, avatar: '/images/trainer-3.jpg', oralScore: [9, 5.8], quizScore: [8], testScore: [9.5, 10], finalScore: 9.2 },
    { id: 4, name: 'Mary Saveley', date: '06/09/2016', role: 'Reviewer', status: true, avatar: '/images/trainer-4.jpg', oralScore: [6.5], quizScore: [7], testScore: [8], finalScore: 7.8 },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleStatus = (id) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, status: !user.status } : user
    );
    setUsers(updatedUsers);
  };

  const saveUsers = () => {
    const userAbsent = users.filter(user => user.status === false);
    console.log(userAbsent);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-500">User Management</h2>
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
              {users.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center font-semibold text-gray-800">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Toggle
                      isOn={user.status}
                      handleToggle={() => toggleStatus(user.id)}
                      userId={user.id} // Ensure unique user ID
                      onColor="bg-green-500"
                      offColor="bg-red-500"
                      tooltipText={user.status ? 'Đã điểm danh' : 'Chưa điểm danh'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GrView
                      className="cursor-pointer"
                      onClick={() => openModal(user)}
                      title="Xem chi tiết"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <button
              onClick={saveUsers}
              className="bg-blue-600 text-white font-bold text-lg px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <Modal show={showModal} onHide={closeModal} size="xl">
          <Modal.Body>
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

                      {/* Điểm miệng */}
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

                      {/* Điểm 15 phút */}
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

                      {/* Điểm 1 tiết */}
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

                      {/* Điểm cuối kì */}
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Tắt
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const updatedUsers = users.map((user) => (user.id === selectedUser.id ? selectedUser : user));
                setUsers(updatedUsers);
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
