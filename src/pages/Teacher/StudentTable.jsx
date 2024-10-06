import React, { useState } from 'react';
import Toggle from '../../components/Toggle/Toggle';
import { GrView } from "react-icons/gr";
import { Modal, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

const StudentTable = ({ idClass, handleBackSchedule }) => {
  const initialUsers = [
    { id: 1, name: 'Michael Holz', date: '04/10/2013', role: 'Admin', avatar: '/images/trainer-1.jpg', oralScore: [8.5, 6], quizScore: [7, 9.8], testScore: [9], finalScore: 8.5 },
    { id: 2, name: 'Paula Wilson', date: '05/08/2014', role: 'Publisher', avatar: '/images/trainer-2.jpg', oralScore: [7], quizScore: [6.5], testScore: [8], finalScore: 7.5 },
    { id: 3, name: 'Antonio Moreno', date: '11/05/2015', role: 'Publisher', avatar: '/images/trainer-3.jpg', oralScore: [9, 5.8], quizScore: [8], testScore: [9.5, 10], finalScore: 9.2 },
    { id: 4, name: 'Mary Saveley', date: '06/09/2016', role: 'Reviewer', avatar: '/images/trainer-4.jpg', oralScore: [6.5], quizScore: [7], testScore: [8], finalScore: 7.8 },
  ];

  // Thêm trạng thái status tạm thời
  const [users, setUsers] = useState(
    initialUsers.map(user => ({ ...user, status: false })) // mặc định là false
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Hàm toggle status của từng user
  const toggleStatus = (id) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, status: !user.status } : user
    );
    setUsers(updatedUsers);
  };

  // Hàm lưu user và trả về danh sách true/false cho từng người
  const saveUsers = () => {
    const absentUserIds = users
      .filter(user => user.status === false)  // Lọc những user có status là false
      .map(user => user.id);                  // Lấy ra id của những user đó

    console.log(absentUserIds);  // Trả về danh sách những student id có status là false
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
                      userId={user.id}
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

          <div className="mt-4 flex justify-between">
            <button
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition duration-300"
              onClick={handleBackSchedule}
            >
              <FaArrowLeft className="mr-2" /> Trở về
            </button>
            <button
              onClick={saveUsers}
              className="bg-green-600 text-white font-bold text-lg px-6 py-3 rounded-lg  hover:bg-green-700 transition duration-300 transform hover:scale-105"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <Modal show={showModal} onHide={closeModal} size="xl">
          <Modal.Body>
            {/* Nội dung modal */}
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
