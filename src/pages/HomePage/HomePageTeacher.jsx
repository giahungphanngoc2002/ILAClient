import React, { useEffect } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useState } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from  '../../components/MessageComponent/Message'
import * as ClassService from '../../services/ClassService'
import { useNavigate } from "react-router-dom";
// import { getAllQuestion } from "../../services/QuestionService";
import {  useSelector } from "react-redux";
export default function HomePageTeacher() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
    
  const handleCloseJoinModal = () => setShowJoinModal(false);
  const handleOpenJoinModal = () => setShowJoinModal(true);
  
  
  const navigate =useNavigate()
  const handleNavigateQuestionAI =() =>{
    navigate( '/myclass')
  }
  const mutation = useMutationHooks (
    data => ClassService.createClass(data)
  )
  // const { data: questions } = getAllQuestion();
  const user =useSelector((state)=> state.user)

  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleOpenCreateModal = () => setShowCreateModal(true);
  

  const {data,  isSuccess , isError} = mutation
useEffect(()=>{
  if(isError){
    message.error()
  }else if (isSuccess && data?.status !== 'ERR'){  
    message.success()
    handleNavigateQuestionAI()
  }
},[isSuccess,isError]
)
const [nameClass, setNameClass] = useState('');
const [classID, setClassID] = useState('');
const [description, setDescription] = useState('');
const[teacherID ,setTeacherID] =useState('')
  const handleOnchangeClassName = (e) => {
    setNameClass(e.target.value);
  }
  const handleOnchangeClassID = (e) => {
    setClassID(e.target.value);
  }
  const handleOnchangeDescription = (e) => {
    setDescription(e.target.value);
  }

  const handleJoinClass = () => {
    // Thực hiện các xử lý khi người dùng nhập mã lớp và bấm "Join Class"
    // ...
  };
  useEffect(()=>{
    setTeacherID(user?.id)
    // setUserAvatar(user?.avatar)
  },[user?.id ])
  const handleCreateClass = () => {
    mutation.mutate({
        nameClass,
        classID,
        description,
        teacherID:user?.id
       
      })
  }
  console.log(data)

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <img src="images/teacher.jpg" alt="" />
        </Col>
        <Col className="d-flex flex-column align-items-center justify-content-center">
          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: "#1766FF",
              height: "48px",
              width: "220px",
              border: "none",
              borderRadius: "4px",
              margin: "26px 0 10px",
            }}
            textButton={"New Class"}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
            onClick={handleOpenCreateModal}
          ></ButtonComponent>
          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: "#1766FF",
              height: "48px",
              width: "220px",
              border: "none",
              borderRadius: "4px",
              margin: "26px 0 10px",
            }}
            textButton={"Join Class"}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
            onClick={handleOpenJoinModal}
          ></ButtonComponent>

                {/* {questions?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))} */}

          <Modal show={showJoinModal} onHide={handleCloseJoinModal}>
            <Modal.Header closeButton>
              <Modal.Title>Enter Class Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input type="text" placeholder="Class Code" />
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
    <div class="mb-4">
      <span class="block text-gray-700 font-bold mb-2">Class Code:</span>
      <input type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="" onChange={handleOnchangeClassName} value={nameClass} />
    </div>
    <div class="mb-4">
      <span class="block text-gray-700 font-bold mb-2">Class ID:</span>
      <input type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="" onChange={handleOnchangeClassID} value={classID} />
    </div>
    <div class="mb-4">
      <span class="block text-gray-700 font-bold mb-2">Class Name:</span>
      <input type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="" onChange={handleOnchangeDescription} value={description} />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseCreateModal} class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Cancel
    </Button>
    <Button disabled={!nameClass.length || !classID.length || !description.length} variant="primary" onClick={handleCreateClass} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Create Class
    </Button>
  </Modal.Footer>
</Modal>
        </Col>
      </Row>
    </div>
  );

}