import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "react-bootstrap";

const ModalCreateTest = ({
  showCreateTestModal,
  handleCloseCreateTestModal,
  handleOnchangeTestID,
  testID,
  handleOnchangePassword,
  password,
  handleCreateTest,
}) => {
  return (
    <Modal show={showCreateTestModal} onHide={handleCloseCreateTestModal}>
      <Modal.Header closeButton>
        <Modal.Title>Create Test</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div class="mb-4">
          <span class="block text-gray-700 font-bold mb-2">Test Code:</span>
          <input
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder=""
            onChange={handleOnchangeTestID}
            value={testID}
          />
        </div>
        <div class="mb-4">
          <span class="block text-gray-700 font-bold mb-2">Password ID:</span>
          <input
            type="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder=""
            onChange={handleOnchangePassword}
            value={password}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseCreateTestModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateTest}>
          Create Test
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateTest;
