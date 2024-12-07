import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "react-bootstrap";

const UpdateQuestionModal = ({
  showUpdateModal,
  handleCloseUpdateModal,
  question,
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
  handleEditLevel,
  textLession, handleLessionChange, toggleEditLession, handleEditLession, saveLession,
  textChapter, handleChapterChange, toggleEditChapter, handleEditChapter, saveChapter
}) => {
  return (
    <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
      <Modal.Header closeButton>
        <Modal.Title>Update Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {question && (
          <>
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700"
              >
                Câu hỏi:
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
                    Lưu
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="m-0 block w-full p-2 border border-gray-300 rounded-md">

                    {question.question}
                  </p>
                  <button
                    onClick={() =>
                      handleEditQuestionn(question.question)
                    }
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Sửa
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label
                htmlFor="correctAnswer"
                className="block text-sm font-medium text-gray-700"
              >
                Đáp án đúng:
              </label>
              {toggleEditCA ? (
                <div>
                  <select
                    value={textCA}
                    onChange={handleCorrectAnswerChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    {question.options.map((answer, index) => (
                      <option key={index} value={answer}>
                        {answer}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={saveCorrectQuestion}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="m-0 block w-full p-2 border border-gray-300 rounded-md">
                    {question.correctAnswer}
                  </p>
                  <button
                    onClick={() => handleEditCA(question.correctAnswer)}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Sửa
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label
                htmlFor="answers"
                className="block text-sm font-medium text-gray-700"
              >
                Câu trả lời:
              </label>
              {question.options.map((answer, index) => (
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
                        Lưu
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
                        Sửa
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
                Độ khó:
              </label>
              {toggleEditLevel ? (
                <div>
                  <select
                    value={textLevel}
                    onChange={handleLevelChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  <button
                    onClick={saveLevel}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="m-0 block w-full p-2 border border-gray-300 rounded-md">
                    {question.level}
                  </p>
                  <button
                    onClick={() => handleEditLevel(question.level)}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Sửa
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="correctAnswer"
                className="block text-sm font-medium text-gray-700"
              >
                Bài học:
              </label>
              {toggleEditLession ? (
                <div>
                  <input
                    type="text"
                    value={textLession}
                    onChange={handleLessionChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={saveLession}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="m-0 block w-full p-2 border border-gray-300 rounded-md">
                    {question.lession}
                  </p>
                  <button
                    onClick={() => handleEditLession(question.lession)}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Sửa
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="correctAnswer"
                className="block text-sm font-medium text-gray-700"
              >
                Chương:
              </label>
              {toggleEditChapter ? (
                <div>
                  <input
                    type="text"
                    value={textChapter}
                    onChange={handleChapterChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={saveChapter}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="m-0 block w-full p-2 border border-gray-300 rounded-md">
                    {question.chapter}
                  </p>
                  <button
                    onClick={() => handleEditChapter(question.chapter)}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Sửa
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

export default UpdateQuestionModal;