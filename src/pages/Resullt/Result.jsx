import Navigation from "./Navigation";
import React, { createContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentQuestion,
  setSelectedAnswer,
  setScore,
  setShowResult,
  setData,
  setError,
} from "./Redux/store";
import { useLocation } from "react-router-dom";

export default function Result() {
  const { currentQuestion, selectedAnswer, score, showResult, data, error } =
    useSelector((state) => state.quiz);
  const { state } = useLocation();
  const saveSelected = state ? state.data : null;

  const newArray = saveSelected
  ? saveSelected.map((item) => ({ ...item }))
  : [];

  saveSelected.sort((a, b) => {
  const questionIndexA = parseInt(
    Object.keys(a)[0].replace("Question", "")
  );
  const questionIndexB = parseInt(
    Object.keys(b)[0].replace("Question", "")
  );
  return questionIndexA - questionIndexB;
});

  console.log(saveSelected);

  
  const dispatch = useDispatch();

  useEffect(() => {
    const apiUrl = "http://localhost:3001/quizs/";
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setData(data));
      })
      .catch((error) => {
        dispatch(setError(error.message));
      });
  }, [dispatch]);

  const finalData = [];

  if (saveSelected) {
    for (var i = 0; i < saveSelected.length; i++) {
      var objectFromArray2 = saveSelected[i];
      var newData = { ...data[i] };
      Object.assign(newData, objectFromArray2);
      finalData.push(newData);
    }
  }
  console.log(finalData);

  if (!data) return null;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <Navigation />
      <h1 style={{backgroundColor:"black", color:"white", textAlign:"center",padding:"30px"}}>Quiz Review</h1>
      {finalData.map((questionData, questionIndex) => {
        const saveSelectedQuestion = saveSelected
          ? saveSelected.find(
              (savedQuestionData) =>
                savedQuestionData.question === questionData.question
            )
          : null;
        const savedAnswer =
          saveSelectedQuestion && saveSelectedQuestion.selectedAnswer;
        return (
          <div key={questionIndex}>
            <ul
              style={{
                backgroundColor:
                  questionData.result === false ? "#f8d7da" : "#d1e7dd",
                borderRadius: "10px",
                border:
                  questionData.result === false
                    ? "3px solid #f6cfd3"
                    : "#d1e7de",
                    listStyleType:"none"
              }}
            >
              <p>
                Q{questionIndex + 1}. {questionData.question}
              </p>
              {questionData.answers.map((answer, answerIndex) => (
                <div>
                  <li key={answerIndex}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={answer}
                        checked={
                          answer ===
                          questionData["Question" + (questionIndex + 1)]
                        }
                        onChange={() => {
                          dispatch(setSelectedAnswer(answer));
                        }}
                      />
                      {answer}
                    </label>
                  </li>
                </div>
              ))}
              <p
              style={{
                backgroundColor:
                  questionData.result === false ? "#ced4da" : "#ced4da",
                borderRadius: "10px",
                border:
                  questionData.result === false
                    ? "3px solid #ccc"
                    : "3px solid #ccc",
              }}
              >Right answer is: {questionData.correctAnswer}</p>
            </ul>
          </div>
        );
      })}
    </div>
  );
}
