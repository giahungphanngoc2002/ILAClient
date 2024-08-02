import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "react-bootstrap";

const ModalUpdate = ({
  showUpdateModal,
  handleCloseUpdateModal,
  filteredQuestion,
  toggleEditQuestion,
  textQuestion,
  handleQuestionChange,
  saveQuestion,
  handleEditQuestionn,
  toggleEditCA,
  textCA,
  handleCorrectAnswerChange,
  saveCorrectQuestion,
  handleEditCA,
  editingAnswerIndex,
  textAnswer,
  handleAnswerChange,
  saveAnswer,
  handleEditAnswer,
  handleUpdateQuestion,
  handleLevelChange,
  textLevel,
  saveLevel,
  toggleEditLevel,
  handleEditLevel
}) => {
  return (
    <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
      <Modal.Header closeButton>
        <Modal.Title>Update Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {filteredQuestion && (
          <>
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700"
              >
                Question:
              </label>
              {toggleEditQuestion ? (
                <div>
                  <input
                    type="text"
                    value={textQuestion}
                    onChange={handleQuestionChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={saveQuestion}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="m-0 block w-full p-2 border border-gray-300 rounded-md">
                    
                    {filteredQuestion.question}
                  </p>
                  <button
                    onClick={() =>
                      handleEditQuestionn(filteredQuestion.question)
                    }
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label
                htmlFor="correctAnswer"
                className="block text-sm font-medium text-gray-700"
              >
                Correct Answer:
              </label>
              {toggleEditCA ? (
                <div>
                  {/* <input
                    type="text"
                    value={textCA}
                    onChange={handleCorrectAnswerChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  /> */}
                  <select
                    value={textCA}
                    onChange={handleCorrectAnswerChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    {filteredQuestion.answers.map((answer, index) => (
                      <option key={index} value={answer}>
                        {answer}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={saveCorrectQuestion}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="m-0 block w-full p-2 border border-gray-300 rounded-md">
                    {filteredQuestion.correctAnswer}
                  </p>
                  <button
                    onClick={() => handleEditCA()}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label
                htmlFor="answers"
                className="block text-sm font-medium text-gray-700"
              >
                Answers:
              </label>
              {filteredQuestion.answers.map((answer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mt-1"
                >
                  {editingAnswerIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={textAnswer}
                        onChange={handleAnswerChange}
                        className="block w-full p-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={saveAnswer}
                        className="bg-green-500 text-white px-4 py-2 rounded ml-4 hover:bg-green-600"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="m-0 block w-full p-2 border border-gray-300 rounded-md">
                        {answer}
                      </p>
                      <button
                        onClick={() => handleEditAnswer(index, answer)}
                        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label
                htmlFor="correctAnswer"
                className="block text-sm font-medium text-gray-700"
              >
                Level:
              </label>
              {toggleEditLevel ? (
                <div>
                  <input
                    type="text"
                    value={textLevel}
                    onChange={handleLevelChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={saveLevel}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="m-0 block w-full p-2 border border-gray-300 rounded-md">
                    {filteredQuestion.level}
                  </p>
                  <button
                    onClick={() => handleEditLevel()}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseUpdateModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateQuestion}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUpdate;
