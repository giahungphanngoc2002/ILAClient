import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/MessageComponent/Message";
import * as ClassService from "../../services/ClassService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function HomePageTeacher() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCloseJoinModal = () => setShowJoinModal(false);
  const handleOpenJoinModal = () => setShowJoinModal(true);
  const navigate = useNavigate();
  const handleNavigateQuestionAI = () => {
    navigate("/myclass");
  };

  const mutation = useMutationHooks((data) => ClassService.createClass(data));
  const user = useSelector((state) => state.user);

  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleOpenCreateModal = (count) => {
    if (count > 0) {
      setShowCreateModal(true);
    } else {
      toast.error("Mua nick");
      navigate(`/pricingCount/`);
    }
  };
  
  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isError) {
      message.error();
    } else if (isSuccess && data?.status !== "ERR") {
      message.success();
      handleNavigateQuestionAI();
    }
  }, [isSuccess, isError]);

  const [nameClass, setNameClass] = useState("");
  const [classID, setClassID] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("false"); 

  const [teacherID, setTeacherID] = useState("");
  const [subject, setSubject] = useState("");

  const handleOnchangeClassName = (e) => {
    setNameClass(e.target.value);
  };

  const handleOnchangeClassID = (e) => {
    setClassID(e.target.value);
  };

  const handleOnchangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleOnchangeSubject = (e) => {
    setSubject(e.target.value);
  };

  // const handleOnchangeStatus = (isChecked) => {
  //   setStatus(isChecked ? "true" : "false");
  // };

  const handleOnchangeStatus = (isChecked) => {
    setStatus(isChecked ? "true" : "false");
  };

  const handleJoinClass = () => {
    // Thực hiện các xử lý khi người dùng nhập mã lớp và bấm "Join Class"
    // ...
  };

  useEffect(() => {
    setTeacherID(user?.id);
  }, [user?.id]);

  const handleCreateClass = () => {
    mutation.mutate({
      nameClass,
      classID,
      description,
      subject,
      status,
      teacherID: user?.id,
    });
  };

  console.log("user", user.id);

  console.log("count", user.count);

  // const checkCountUser = (id, count) => {
  //   if(count > 0){
  //     console.log("123")
  //   }
  // }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            src="https://cf.quizizz.com/image/emptystate-likeanactivity.png"
            alt="Teacher"
            className="mx-auto h-48 w-auto"
          />
          <h2 className="mt-6 text-center   font-semibol text-lg text-gray-900 ">
            Welcome, Teacher
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
            Classes you like will appear here. You can use this space to collect
            great content created by other teachers.
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-5">
          <button
            onClick={() => handleOpenCreateModal(user.count)}
            className=" flex justify-center py-2 px-4 border font-sans border-transparent  rounded-md font-semibold text-sm  text-white bg-purple-500 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Create Class
          </button>
          <button
            onClick={handleOpenJoinModal}
            className=" flex justify-center py-2 px-4 border font-sans border-transparent text-sm font-semibold   rounded-md text-gray-500 bg-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Join Class
          </button>
        </div>
      </div>

      <Modal show={showJoinModal} onHide={handleCloseJoinModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Class Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Class Code"
            className="w-full py-2 px-3 border rounded focus:outline-none focus:shadow-outline"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseJoinModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleJoinClass}>
            Join Class
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block font-semibold text-gray-700 mb-2">
                Class ID
              </label>
              <input
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Class ID"
                onChange={handleOnchangeClassID}
                value={classID}
              />
            </div>
            <div>
              <label class="block font-semibold text-gray-700 mb-2">
                Class Name
</label>
              <input
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Class Name"
                onChange={handleOnchangeClassName}
                value={nameClass}
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block font-semibold text-gray-700 mb-2">
              Class Description
            </label>
            <input
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Class Name"
              onChange={handleOnchangeDescription}
              value={description}
            />
          </div>

          <div class="mb-4">
            <label class="block font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <select
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleOnchangeSubject}
              value={subject}
            >
              <option value="">Select Subject</option>
              <option value="tuNhien">Tự nhiên</option>
              <option value="xaHoi">Xã hội</option>
            </select>
          </div>

          <div class="mb-4 flex items-center">
            <label class="block font-semibold text-gray-700 mr-4">Public</label>
            <label class="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                class="sr-only peer"
                onChange={(e) => handleOnchangeStatus(e.target.checked ? "true" : "false")}
                  checked={status === "true"}
              />
              <div class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseCreateModal}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </Button>
          <Button
            disabled={
              !nameClass.length || !classID.length || !description.length
            }
            variant="primary"
            onClick={handleCreateClass}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
Create Class
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}