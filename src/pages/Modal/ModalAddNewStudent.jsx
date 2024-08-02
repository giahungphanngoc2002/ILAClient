import { AutoComplete } from "antd";
import { Button, Modal } from "react-bootstrap";

const ModalAddNewStudent = ({
  showAddNewStudentModal,
  handleCloseAddNewStudentModal,
  options,
  onSearch,
  onSelectOption,
  inputValue,
  handleInputChange,
  handleAddStudentToClass
}) => {
  return (
    <Modal show={showAddNewStudentModal} onHide={handleCloseAddNewStudentModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold mb-2">
            Name Student:
          </span>
          <AutoComplete
            options={options}
            style={{ width: "100%" }}
            onSearch={onSearch}
            onSelect={onSelectOption}
            value={inputValue}
            getPopupContainer={(trigger) => trigger.parentNode} // Ensures dropdown is within modal
          >
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Nhập Thông Tin Học Sinh"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </AutoComplete>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseAddNewStudentModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddStudentToClass}>
          Add Student
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddNewStudent;