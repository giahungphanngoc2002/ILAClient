import axios from "axios";
import React, { Suspense, useState } from "react";

import { Container, Col, Row } from "react-bootstrap";

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
  <span className="visually-hidden">Loading...</span>
</div>
    </div>
  );
};

export default function SearchQuestionByAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  

  async function generateAnswer() {
    setLoading(true);
    const addText = `
    xin 10 câu hỏi trắc nghiệm về đoạn văn này theo format dưới đây
    [
    {
    "text": "Điền câu hỏi vào đây",
    "options": [
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây"
    ],
    "correctAnswer": "Điền đáp án vào đây."
    },
    {
    "text": "Điền câu hỏi vào đây",
    "options": [
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây",
    "Điền các kết quả để chọn vào đây"
    ],
    "correctAnswer": "Điền đáp án vào đây."
    },
    {
    "text": "Điền câu hỏi vào đây",
    "options": [
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

    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAmhcR2Olj1sd4BzsgEfy28_d67sKTz-kI",
      method: "POST",
      data: {
        contents: [{ parts: [{ text: question + addText }] }],
      },
    });

    setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]);

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
    console.log(parsedAnswer);
    setLoading(false);
  }

  function handleDeleteQuestion(index) {
    const updatedQuestions = questions.filter((_, questionIndex) => questionIndex !== index);
    setQuestions(updatedQuestions);
    console.log(questions)
  }

  return (
    <div className="home-page-teacher p-6 text-center">
      <h1 className="text-xl font-bold mb-4">Chat AI</h1>
      <textarea
        className="question-input w-full h-40 p-2 mb-4 border rounded w-full"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Nhập đoạn văn bạn muốn tạo ra câu hỏi"
      ></textarea>
      <button
        className="generate-button bg-green-500 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={generateAnswer}
      >
        Generate answer
      </button>
      {loading ? (
        <Loading />
      ) : (
        <Container>
        {questions.map((question, key) => (
          <div key={key}>
            <Row>
              <Col xs={10}>
                <div className="mt-10">
                  <Row>
                    <Col xs={12}>
                      <h2 className="text-left mb-4">Question: {question.text}</h2>
                    </Col>
                  </Row>
                  <Row className="">
                    {question.options.map((answer, index) => (
                      <Col key={index} xs={6}>
                        <li
                          className="p-3 rounded-3 border border-info"
                          style={{
                            listStyleType: "none",
                            backgroundColor: "#c9dfff",
                          }}
                        >
                          <label>
                            <input
                              type="radio"
                              name="answer"
                              value={answer}
                            />
                            {answer}
                          </label>
                        </li>
                        <br />
                      </Col>
                    ))}
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <p className="border-2 rounded-3 bg-green-200 p-2 text-left border-green-500">Correct answer: {question.correctAnswer}</p>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col
                xs={1}
                className="d-flex align-items-center justify-content-center"
                onClick={() => handleDeleteQuestion(key)}
              >
                <button className="btn btn-danger">X</button>
              </Col>
            </Row>
          </div>
        ))}
      </Container>
      )}
      
      <button>Add vào lớp học</button>
    </div>
  );
}
