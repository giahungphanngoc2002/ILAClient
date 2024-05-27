import React, { useEffect } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useState } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from  '../../components/MessageComponent/Message'
import * as UserService from '../../services/UserService'
import { useNavigate } from "react-router-dom";

export default function HomePageTeacher() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
    
  const handleCloseJoinModal = () => setShowJoinModal(false);
  const handleOpenJoinModal = () => setShowJoinModal(true);
  
  
  const navigate =useNavigate()
  const handleNavigateQuestionAI =() =>{
    navigate( '/questionAI')
  }
  const mutation = useMutationHooks (
    data => UserService.createClass(data)
  )

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

  const handleCreateClass = () => {
    mutation.mutate({
        nameClass,
        classID,
        description
       
      })
  }

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
                <input type="text" placeholder="Class Code" onChange={handleOnchangeClassName} value={nameClass} />
                <input type="text" placeholder="classID" onChange={handleOnchangeClassID} value={classID} />
                <input type="text" placeholder="description" onChange={handleOnchangeDescription} value={description} />
              
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseCreateModal}>
                Cancel
              </Button>
              <Button 
              disabled ={!nameClass.length || !classID.length ||!description.length}
              variant="primary" onClick={handleCreateClass}>
                Create Class
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </div>
  );

}