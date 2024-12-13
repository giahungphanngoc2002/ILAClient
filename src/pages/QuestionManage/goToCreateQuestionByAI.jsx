import axios from "axios";
import React, { useEffect, useState } from "react";
import * as message from "../../components/MessageComponent/Message";
import * as SubjectService from "../../services/SubjectService";
import { useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import mammoth from "mammoth";
import { toast } from "react-toastify";

const Loading = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="spinner-border text-primary"
        style={{ width: "4rem", height: "4rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default function SearchQuestionByAI() {
  const classTeacher = useSelector((state) => state.class);
  const [classTeacherName, setClassTeacherName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailSubject, setDetailSubject] = useState("");
  const [buttonColor, setButtonColor] = useState("gray");
  const [showWarning, setShowWarning] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // Câu hỏi đang chỉnh sửa
  const [updatedQuestion, setUpdatedQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    level: [1, 2, 3],
    chapter: "",
    lession: ""
  });
  const navigate = useNavigate();

  const countWords = (text) => {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  useEffect(() => {
    const wordCount = countWords(question);
    if (wordCount < 1) {
      setButtonColor("gray");
      setShowWarning(true); // Nếu ít hơn 400 từ, hiển thị cảnh báo
    } else {
      setButtonColor("green");
      setShowWarning(false); // Nếu đủ 400 từ, ẩn cảnh báo
    }
  }, [question]);

  const { idClass, idSubject } = useParams();


  useEffect(() => {
    const fetchDetailSubject = async () => {
      setLoading(true);
        try {
            const detailSubjectData = await SubjectService.getDetailSubject(idSubject);
            setDetailSubject(detailSubjectData?.chapters);
        } catch (error) {
            console.error("Error fetching time tables:", error);
        } finally {
          setLoading(false);
        }
    };
    fetchDetailSubject();
}, [idSubject]);
 console.log("chapters ", detailSubject);

  const handleUpdate = async () => {
    try {
      if (questions.length === 0) {
        message.error("No questions available to add.");
        return;
      }

      setLoading(true);

      const response = await SubjectService.createQuestion(idClass, idSubject, questions);

      console.log(response); // Kiểm tra nội dung phản hồi

      if (response.message === "Question created successfully" && response.subject) {
        message.success("Questions added successfully!");
        navigate("/manage")
        setQuestions([]);
      } else {
        message.error(`Failed to add questions. ${response.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error adding questions:", error);
      message.error("An error occurred while adding questions.");
    } finally {
      setLoading(false);
    }
  };




  async function generateAnswer() {
    setLoading(true);
    setError("");
    const addText = `
      theo format dưới đây
      [
  {
    "question": "Điền câu hỏi vào đây",
    "options": [
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây"
    ],
    "correctAnswer": "Điền đáp án vào đây",
    "level": [1,2,3],
    "chapter": "Tên chương học",
    "lession": "Tên bài học"
  },
  {
    "question": "Điền câu hỏi vào đây",
    "options": [
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây"
    ],
    "correctAnswer": "Điền đáp án vào đây",
    "level": [1,2,3],
    "chapter": "Tên chương học",
    "lession": "Tên bài học"
  },
  {
    "question": "Điền câu hỏi vào đây",
    "options": [
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây"
    ],
    "correctAnswer": "Điền đáp án vào đây",
    "level": [1,2,3],
    "chapter": "Tên chương học",
    "lession": "Tên bài học"
  }
]
      `;
    const addText2 = `chỉnh lại cho chuẩn json sau`;

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAmhcR2Olj1sd4BzsgEfy28_d67sKTz-kI",
        method: "POST",
        data: {
          contents: [{ parts: [{ text: question + addText }] }],
        },
      });

      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );

      const response2 = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAmhcR2Olj1sd4BzsgEfy28_d67sKTz-kI",
        method: "POST",
        data: {
          contents: [
            {
              parts: [
                {
                  text:
                    response["data"]["candidates"][0]["content"]["parts"][0][
                    "text"
                    ] + addText2,
                },
              ],
            },
          ],
        },
      });

      const parsedAnswer = JSON.parse(
        response2["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );

      setQuestions(parsedAnswer);
      message.success("Questions generated successfully!");
      console.log(parsedAnswer);
    } catch (error) {
      message.error("An error Questions generated ");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteQuestion(index) {
    const updatedQuestions = questions.filter(
      (_, questionIndex) => questionIndex !== index
    );
    setQuestions(updatedQuestions);
    console.log(questions);
  }

  function readWordFile() {
    const fileInput = document.getElementById("file-input");
    const textQuestion = document.getElementById("textQuestion");

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const arrayBuffer = e.target.result;

        mammoth
          .extractRawText({ arrayBuffer: arrayBuffer })
          .then(function (result) {
            const content = result.value;
            textQuestion.value = content;
            console.log(content);
            setQuestion(content);
          })
          .catch(function (error) {
            console.error("Error reading Word file:", error);
          });
      };

      reader.onerror = function (error) {
        console.error("Error reading Word file:", error);
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.error("No file selected.");
    }
  }

  const handleUpdateQuestion = (index) => {
    const questionToEdit = questions[index];
    setEditingQuestion(index); // Lưu chỉ số câu hỏi đang chỉnh sửa
    setUpdatedQuestion({
      question: questionToEdit.question,
      options: questionToEdit.options,
      correctAnswer: questionToEdit.correctAnswer,
      level: questionToEdit.level,
      chapter: questionToEdit.chapter,
      lession: questionToEdit.lession
    });
  }

  const handleSaveUpdatedQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion; // Cập nhật câu hỏi đã sửa

    setQuestions(updatedQuestions); // Cập nhật danh sách câu hỏi
    setEditingQuestion(null); // Đóng modal
    message.success("Question updated successfully!");
  }

  return (
    <div className="p-6 text-center h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chat AI</h1>
      <textarea
        className="question-input w-full h-40 p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
        id="textQuestion"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Nhập đoạn văn bạn muốn tạo ra câu hỏi"
      ></textarea>
      {showWarning && (
        <p className="text-red-500"></p>
      )}
      <div className="mb-4">
        <input
          type="file"
          id="file-input"
          accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
          className="file-input w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        className="generate-button bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        onClick={readWordFile}
      >
        Read Word File
      </button>
      <button
        className={`generate-button bg-${buttonColor}-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-200 ml-4`}
        onClick={generateAnswer}
        disabled={buttonColor === "gray"}
      >
        Generate Answer
      </button>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto mt-6">
          {questions.map((questionn, key) => (
            <div key={key} className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-left text-gray-800 mb-4">
                  Question: {questionn?.question}
                </h2>
                <div className="flex flex-wrap -mx-2 mb-4">
                  {questionn?.options.map((answer, index) => (
                    <div key={index} className="w-full sm:w-1/2 px-2 mb-4">
                      <li className="p-3 bg-blue-100 rounded-lg border border-blue-300 list-none">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="answer"
                            value={answer}
                            className="mr-2"
                          />
                          {answer}
                        </label>
                      </li>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <p className="border-2 rounded-lg bg-green-200 p-3 text-left border-green-500">
                    Correct answer: {questionn?.correctAnswer}
                  </p>
                  <p className="border-2 rounded-lg bg-green-200 p-3 text-left border-green-500">
                    Level: {questionn?.level}
                  </p>
                  <p className="border-2 rounded-lg bg-green-200 p-3 text-left border-green-500">
                    Chapter: {questionn?.chapter}
                  </p>
                  <p className="border-2 rounded-lg bg-green-200 p-3 text-left border-green-500">
                    Lesson: {questionn?.lession}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  className="btn btn-danger bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                  onClick={() => handleDeleteQuestion(key)}
                >
                  Delete
                </button>
                <button
                  style={{ backgroundColor: "#2563EB" }}
                  className="btn text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  onClick={() => handleUpdateQuestion(key)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ButtonComponent
        onClick={handleUpdate}
        size={40}
        styleButton={{
          height: "40px",
          width: "fit-content",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "2px 6px 6px",
        }}
        textButton={"Add vào lớp học"}
        styleTextButton={{
          color: "rgb(26, 148, 255",
          fontSize: "15px",
          fontWeight: "700",
        }}
      ></ButtonComponent>

      {editingQuestion !== null && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            {/* <h3 className="text-xl font-semibold mb-4">Chỉnh sửa câu hỏi</h3> */}
            <div className="text-left">
              <h5>Câu hỏi:</h5>
              <textarea
                value={updatedQuestion.question}
                onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, question: e.target.value })}
                className="w-full h-20 p-2 mb-4 border border-gray-300 rounded-lg"
                placeholder="Update the question..."
              />
            </div>
            <div className="text-left">
              <h5>Các đáp án:</h5>

              {updatedQuestion.options.map((option, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...updatedQuestion.options];
                      updatedOptions[index] = e.target.value;
                      setUpdatedQuestion({ ...updatedQuestion, options: updatedOptions });
                    }}
                    className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="text-left">
              <h5>Đáp án đúng:</h5>
              <select
                value={updatedQuestion.correctAnswer}
                onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, correctAnswer: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              >
                <option value="" disabled>Chọn đáp án đúng</option>
                {updatedQuestion.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-left">
              <h5>Độ khó:</h5>
              <select
                value={updatedQuestion.level}
                onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, level: parseInt(e.target.value, 10) })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            <div className="text-left">
              <h5>Chương</h5>
              <select
                value={updatedQuestion.chapter}
                onChange={(e) => {
                  const selectedChapter = e.target.value;
                  setUpdatedQuestion({
                    ...updatedQuestion,
                    chapter: selectedChapter,
                    lession: "", // Reset bài học khi chọn chương mới
                  });
                }}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              >
                <option value="" disabled>Chọn chương</option>
                {detailSubject &&
                  detailSubject.map((chapter) => (
                    <option key={chapter._id} value={chapter.nameChapter}>
                      {chapter.nameChapter}
                    </option>
                  ))}
              </select>
            </div>

            <div className="text-left">
              <h5>Bài học</h5>
              <select
                value={updatedQuestion.lession}
                onChange={(e) =>
                  setUpdatedQuestion({ ...updatedQuestion, lession: e.target.value })
                }
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                disabled={!updatedQuestion.chapter} // Vô hiệu hóa nếu chưa chọn chương
              >
                <option value="" disabled>Chọn bài học</option>
                {updatedQuestion.chapter &&
                  detailSubject
                    .find((chapter) => chapter.nameChapter === updatedQuestion.chapter)
                    ?.lession.map((lesson, index) => (
                      <option key={index} value={lesson}>
                        {lesson}
                      </option>
                    ))}
              </select>
            </div>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setEditingQuestion(null)} // Đóng modal
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleSaveUpdatedQuestion(editingQuestion)} // Lưu câu hỏi
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
