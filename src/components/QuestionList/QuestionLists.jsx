// QuestionsList.js
import React from 'react';
import { Container, Col, Row } from "react-bootstrap";

function QuestionsList({ questions, handleDeleteQuestion }) {
  return (
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
  );
}

export default QuestionsList;
