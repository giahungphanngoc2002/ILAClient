import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalAddNewStudent = ({
  showAddQuestionToTestModal,
  handleCloseAddQuestionToTestModal,
  handleSelectChangeeee,
  handleSelectChange,
  tests,
  handleOnchangeTimeeee,
  time,
  handleCreateQuestionByTestId,
}) => {
  return (
    <Modal
      show={showAddQuestionToTestModal}
      onHide={handleCloseAddQuestionToTestModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Question To Test</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold mb-2">ID Test:</span>
          <select
            onChange={handleSelectChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option key="" value="">
              Select a test
            </option>
            {tests.map((test) => (
              <option key={test.iDTest} value={test._id}>
                {test.iDTest}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <span className="block text-gray-700 font-bold mb-2">Time:</span>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter time"
            onChange={handleOnchangeTimeeee}
            value={time}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseAddQuestionToTestModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateQuestionByTestId}>
          Create Test
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddNewStudent;
