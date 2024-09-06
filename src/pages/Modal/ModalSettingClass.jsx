import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalSettingClass = ({
    showSettingModal,
    handleCloseSettingModal,
    isLoading,
    isError,
    handleOnchangeClassID,
    handleOnchangeClassName,
    handleOnchangeDescription,
    handleOnchangeSubject,
    handleOnchangeStatus,
    classID,
    nameClass,
    subject,
    description,
    status,
    handleSaveClass
}) => {
    return (
        <Modal show={showSettingModal} onHide={handleCloseSettingModal}>
            <Modal.Header closeButton>
                <Modal.Title>Class Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2">
                            Class ID
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter Class ID"
                            onChange={handleOnchangeClassID}
                            value={classID}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2">
                            Class Name
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter Class Name"
                            onChange={handleOnchangeClassName}
                            value={nameClass}
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block font-semibold text-gray-700 mb-2">
                        Class Description
                    </label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Class Description"
                        onChange={handleOnchangeDescription}
                        value={description}
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold text-gray-700 mb-2">
                        Subject
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={handleOnchangeSubject}
                        value={subject}
                    >
                        <option value="">Select Subject</option>
                        <option value="tuNhien">Tự nhiên</option>
                        <option value="xaHoi">Xã hội</option>
                    </select>
                </div>
                <div className="mb-4 flex items-center">
                    <label className="block font-semibold text-gray-700 mr-4">Public</label>
                    <label className="inline-flex relative items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            onChange={handleOnchangeStatus}
                            checked={status}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleCloseSettingModal}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Cancel
                </Button>
                <Button
                    // Add your save logic here if needed
                    variant="primary"
                    onClick={handleSaveClass}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalSettingClass;
