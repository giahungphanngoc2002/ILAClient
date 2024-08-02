import axios from "axios";
import React, { useEffect, useState } from "react";
import * as message from "../../components/MessageComponent/Message";
import * as ClassService from "../../services/ClassService";
import { useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import mammoth from "mammoth";
import { useQuery } from "@tanstack/react-query";

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
  const [buttonColor, setButtonColor] = useState("gray");
  const [showWarning, setShowWarning] = useState(false);
  const [status, setStatus] = useState("");
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
  const { id } = useParams();

  const handleGetDetailsClass = async (id) => {
    const classDetails = await ClassService.getDetailClass(id);
    return classDetails;
  };

  const { data: detailClass } = useQuery({
    queryKey: ["detailClass", id],
    queryFn: () => handleGetDetailsClass(id),
  });

  console.log("123444", detailClass?.data.subject);

  const handleUpdate = async () => {
    try {
      const classDetails = await handleGetDetailsClass(id);

      const currentQuestions = classDetails.questions || [];

      console.log("Current Questions:", currentQuestions);

      const updatedQuestions = [...currentQuestions, ...questions];

      const result = await ClassService.addQuestionById(id, updatedQuestions);

      if (result.status === "OK") {
        message.success(result.message);
        handleGetDetailsClass(id);
        navigate(`/viewClass/${id}`);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error("Error while adding question:", error);
      message.error("An error occurred while adding questions.");
    }
  };

  async function generateAnswer() {
    setLoading(true);
    setError("");
    const addTextXaHoi = `
      xin 10 câu hỏi trắc nghiệm về đoạn văn này theo format dưới đây
      [
      {
      "question": "Điền câu hỏi vào đây",
      "level": "Điền vào đây cấp độ khó 1 hoặc 2 hoặc 3",
      "answers": [
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây"
      ],
      "correctAnswer": "Điền đáp án vào đây."
      },
      {
      "question": "Điền câu hỏi vào đây",
      "level": "Điền vào đây cấp độ khó 1 hoặc 2 hoặc 3",
      "answers": [
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây"
      ],
      "correctAnswer": "Điền đáp án vào đây."
      },
      {
      "question": "Điền câu hỏi vào đây",
      "level": "Điền vào đây cấp độ khó 1 hoặc 2 hoặc 3",
      "answers": [
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây"
      ],
      "correctAnswer": "Điền đáp án vào đây."
      },
      ]
      `;

    const addTextTuNhien = `
      xin 10 câu hỏi trắc nghiệm các dạng tương tự bài này theo format dưới đây
      [
      {
      "question": "Điền câu hỏi vào đây",
      "level": "Điền vào đây cấp độ khó 1 hoặc 2 hoặc 3",
      "answers": [
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây"
      ],
      "correctAnswer": "Điền đáp án vào đây."
      },
      {
      "question": "Điền câu hỏi vào đây",
      "level": "Điền vào đây cấp độ khó 1 hoặc 2 hoặc 3",
      "answers": [
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây"
      ],
      "correctAnswer": "Điền đáp án vào đây."
      },
      {
      "question": "Điền câu hỏi vào đây",
      "level": "Điền vào đây cấp độ khó 1 hoặc 2 hoặc 3",
      "answers": [
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây",
      "Điền các kết quả để chọn vào đây"
      ],
      "correctAnswer": "Điền đáp án vào đây."
      },
      ]
      `;
    const addText2 = `chỉnh lại cho chuẩn json`;

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAmhcR2Olj1sd4BzsgEfy28_d67sKTz-kI",
        method: "POST",
        data: {
          contents: [
            {
              parts: [
                {
                  text:
                    question +
                    (detailClass?.data.subject.includes("tuNhien")
                      ? addTextTuNhien
                      : addTextXaHoi),
                },
              ],
            },
          ],
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

  console.log("questionssss", questions);
  return (
    <div className="home-page-teacher p-6 text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chat AI</h1>
      <textarea
        className="question-input w-full h-40 p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
        id="textQuestion"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Nhập đoạn văn bạn muốn tạo ra câu hỏi"
      ></textarea>
      {showWarning && (
        <p className="text-red-500">
          Đoạn văn cần có ít nhất 150 từ để tạo câu hỏi.
        </p>
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
        <div className="container mx-auto mt-6 px-4 sm:px-6 lg:px-8">
  {questions.map((questionn, key) => (
    <div key={key} className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-left text-gray-900 mb-3">
          Question: {questionn.question}
        </h2>
        <div className="flex items-center mb-6">
          <span
            className={`py-1 px-4 rounded-full text-base font-semibold ${
              questionn.level === 1
                ? "bg-green-100 text-green-600"
                : questionn.level === 2
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {questionn.level === 1
              ? "Easy"
              : questionn.level === 2
              ? "Medium"
              : "Hard"}
          </span>
        </div>
        <div className="flex flex-wrap -mx-2">
          {questionn.answers.map((answer, index) => (
            <div key={index} className="w-full sm:w-1/2 px-2 mb-4">
              <li className="p-4 bg-blue-50 rounded-lg border border-blue-300 list-none hover:bg-blue-100 transition duration-200">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`answer-${key}`}
                    value={answer}
                    className="mr-2"
                  />
                  {answer}
                </label>
              </li>
            </div>
          ))}
        </div>
        <p className="border-2 rounded-lg bg-green-100 p-4 text-left border-green-300 text-green-800 font-medium mt-4">
          Correct answer: {questionn.correctAnswer}
        </p>
      </div>
      <div className="text-right">
        <button
          className="bg-red-500 text-white py-2 px-5 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition duration-200"
          onClick={() => handleDeleteQuestion(key)}
        >
          Delete
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
    </div>
  );
}
