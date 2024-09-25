import { Button, Modal } from "react-bootstrap";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const JoinQuizModal = ({
    showLinkModal,
    handleCloseLinkModal,
    handleBack,
    assignment,
    handleOnchangeTestID,
    testID,
    handleOnchangePassword,
    password,
    handleGoToLearning,
    handleCheckAssignment,
    goToTest
}) => {
    return (
        <Modal
            show={showLinkModal}
            onHide={handleCloseLinkModal}
        >
            <Modal.Header closeButton>
                <button
                    className="flex items-center text-white px-4 py-2 rounded-md"
                    onClick={handleBack}
                >
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="text-gray-500 mr-2"
                    />
                </button>
                <Modal.Title>{!assignment ? "Choose Option" : "Enter ID and Password"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-6 py-4 bg-white">
                {assignment ? (
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Code:
                            </label>
                            <input
                                type="text"
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your code"
                                onChange={handleOnchangeTestID}
                                value={testID}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Password ID:
                            </label>
                            <input
                                type="password"
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your password"
                                onChange={handleOnchangePassword}
                                value={password}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center space-x-6">
                        <button
                            className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            onClick={handleGoToLearning}
                        >
                            Learning
                        </button>
                        <button
                            className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition duration-300"
                            onClick={handleCheckAssignment}
                        >
                            Assignment
                        </button>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleCloseLinkModal}
                >
                    Close
                </Button>
                {assignment && (
                    <Button onClick={goToTest} variant="primary">
                        Go To Assignment
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default JoinQuizModal;