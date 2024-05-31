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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Review() {
  const { currentQuestion, selectedAnswer, score, showResult, data, error } =
    useSelector((state) => state.quiz);
  const { state } = useLocation();
  const saveSelected = state ? state.data : null;

  const newArray = saveSelected
    ? saveSelected.map((item) => ({ ...item }))
    : [];

  saveSelected.sort((a, b) => {
    const questionIndexA = parseInt(Object.keys(a)[0].replace("Question", ""));
    const questionIndexB = parseInt(Object.keys(b)[0].replace("Question", ""));
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
      <h1
        style={{
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
          padding: "30px",
        }}
      >
        Quiz Review
      </h1>
      <Row>

      {finalData.map((questionData, questionIndex) => (
  <Col
    md={1}
    key={questionIndex}
    style={{
      backgroundColor: "#d1e7dd",
      borderRadius: "10px",
      border: "3px solid #d1e7de",
      listStyleType: "none",
    }}
  >
    <div key={questionIndex} style={{ width: "100%" }}>
      <p>Question No {questionIndex + 1}</p>
      <p style={{ textDecoration: "underline" }}>Answered</p>
    </div>
  </Col>
))}
      </Row>
    </div>
  );
}
