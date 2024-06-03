import React, { createContext, useEffect, useState } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import {
  setCurrentQuestion,
  setSelectedAnswer,
  setScore,
  setShowResult,
  setSaveSelected,
  setData,
  setError,
} from "../../redux/slices/quizSlice";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Directional from "../../components/DirectionComponent/Direction";
import { Container, Col, Row } from "react-bootstrap";
import { useSaveSelected } from "../../redux/QuizState";
import { useQuery } from "@tanstack/react-query";
import * as ClassService from "../../services/ClassService";

export const QuizzContext = createContext();
export const quizData = [];

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saveSelected, setSaveSelected] = useSaveSelected();
  const { id } = useParams();

  const GetDetailsClass = (id) => async () => {
    const res = await ClassService.getDetailClass(id);
    return res;
  };

  const {
    data: detailClassByID,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["detailClassByID", id],
    queryFn: GetDetailsClass(id),
  });


  console.log(detailClassByID?.data)

  console.log(saveSelected);

  const dispatch = useDispatch();
  const { currentQuestion, selectedAnswer, score, showResult, data, error } =
    useSelector((state) => state.quiz);

  console.log("selected answer :" + selectedAnswer);

  useEffect(() => {
    const savedData = location.state?.saveSelected;
    if (savedData) {
      setSaveSelected(savedData);
    }
  }, [location.state, setSaveSelected]);

  useEffect(() => {
    dispatch(setData(detailClassByID?.data.questions))
  })

  if (error) return <div>Error: {error}</div>;

  const handleAnswerSelect = (answer) => {
    dispatch(setSelectedAnswer(answer));
  };

  const checkResult = () => {
    if (selectedAnswer === currentQuizQuestion.correctAnswer) {
      setScore(score + 1);
      console.log("score",score)
      return true;
    } else {
      return false;
    }
  };

  const handleNextQuestion = () => {
    const questionExists = saveSelected.some(
      (answer) => Object.keys(answer)[0] === `Question${currentQuestion + 1}`
    );

    if (questionExists) {
      console.log(
        `Question${currentQuestion + 1} already exists in saveSelected`
      );
      console.log(
        "Selected answer: " +
          selectedAnswer +
          " current: " +
          (currentQuestion + 1)
      );
      const updatedSaveSelected = saveSelected.filter(
        (answer) =>
          Object.keys(answer)[0] !== `Question${currentQuestion + 1}` &&
          Object.keys(answer)[0] !== "result"
      );

      setSaveSelected([
        ...updatedSaveSelected,
        {
          [`Question${currentQuestion + 1}`]: selectedAnswer,
          result: checkResult(),
        },
      ]);
    } else {
      if (selectedAnswer === currentQuizQuestion.correctAnswer) {
        dispatch(setScore(score + 1));
      }
      setSaveSelected((prevSelected) => [
        ...prevSelected,
        {
          [`Question${currentQuestion + 1}`]: selectedAnswer,
          result: checkResult(),
        },
      ]);
    }

    const previousSelectedAnswer = selectedAnswer; // Lưu trữ giá trị selectedAnswer trước khi gọi setSelectedAnswer(null)

    dispatch(setCurrentQuestion(currentQuestion + 1));

    if (currentQuestion !== currentQuizQuestion.length - 1) {
      dispatch(setSelectedAnswer(null));
      const nextQuestion = saveSelected.find(
        (item) => Object.keys(item)[0] === `Question${currentQuestion + 2}`
      );
      if (nextQuestion) {
        const nextAnswer = nextQuestion[`Question${currentQuestion + 2}`];
        dispatch(setSelectedAnswer(nextAnswer));
      }
    } else {
      dispatch(setSelectedAnswer(previousSelectedAnswer)); // Gán lại giá trị selectedAnswer nếu là câu hỏi cuối cùng
    }
  };

  const handlePrevQuestion = () => {
    const questionExists = saveSelected.some(
      (answer) => Object.keys(answer)[0] === `Question${currentQuestion + 1}`
    );

    if (questionExists) {
      console.log(
        `Question${currentQuestion + 1} already exists in saveSelected`
      );
      console.log(
        "Selected answer: " + selectedAnswer + " current: " + currentQuestion
      );
      const updatedSaveSelected = saveSelected.filter(
        (answer) =>
          Object.keys(answer)[0] !== `Question${currentQuestion + 1}` &&
          Object.keys(answer)[0] !== "result"
      );

      setSaveSelected([
        ...updatedSaveSelected,
        {
          [`Question${currentQuestion + 1}`]: selectedAnswer,
          result: checkResult(),
        },
      ]);
    } else {
      if (selectedAnswer === currentQuizQuestion.correctAnswer) {
        dispatch(setScore(score + 1));
      }
      setSaveSelected((prevSelected) => [
        ...prevSelected,
        {
          [`Question${currentQuestion + 1}`]: selectedAnswer,
          result: checkResult(),
        },
      ]);
    }

    const previousSelectedAnswer = selectedAnswer;

    dispatch(setCurrentQuestion(currentQuestion - 1));

    if (currentQuestion) {
      dispatch(setSelectedAnswer(null));
      const prevQuestion = saveSelected.find(
        (item) => Object.keys(item)[0] === `Question${currentQuestion}`
      );
      if (prevQuestion) {
        const prevAnswer = prevQuestion[`Question${currentQuestion}`];
        dispatch(setSelectedAnswer(prevAnswer));
      }
    } else {
      dispatch(setSelectedAnswer(previousSelectedAnswer));
    }
  };

  const handleFirstQuestion = () => {
    const questionExists = saveSelected.some(
      (answer) => Object.keys(answer)[0] === `Question${currentQuestion + 1}`
    );

    if (questionExists) {
      console.log(
        `Question${currentQuestion + 1} already exists in saveSelected`
      );
      console.log(
        "Selected answer: " +
          selectedAnswer +
          " current: " +
          (currentQuestion + 1)
      );
      const updatedSaveSelected = saveSelected.filter(
        (answer) =>
          Object.keys(answer)[0] !== `Question${currentQuestion + 1}` &&
          Object.keys(answer)[0] !== "result"
      );

      setSaveSelected([
        ...updatedSaveSelected,
        {
          [`Question${currentQuestion + 1}`]: selectedAnswer,
          result: checkResult(),
        },
      ]);
    } else {
      if (selectedAnswer === currentQuizQuestion.correctAnswer) {
        dispatch(setScore(score + 1));
      }
      setSaveSelected((prevSelected) => [
        ...prevSelected,
        {
          [`Question${currentQuestion + 1}`]: selectedAnswer,
          result: checkResult(),
        },
      ]);
    }

    const previousSelectedAnswer = selectedAnswer;

    dispatch(setCurrentQuestion(0));

    if (currentQuestion !== currentQuizQuestion.length - 1) {
      dispatch(setSelectedAnswer(null));
      const nextQuestion = saveSelected.find(
        (item) => Object.keys(item)[0] === `Question${currentQuestion + 2}`
      );
      if (nextQuestion) {
        const nextAnswer = nextQuestion[`Question${currentQuestion + 2}`];
        dispatch(setSelectedAnswer(nextAnswer));
      }
    } else {
      dispatch(setSelectedAnswer(previousSelectedAnswer));
    }
  };

  const handleLastQuestion = () => {
    const questionExists = saveSelected.some(
      (answer) => Object.keys(answer)[0] === `Question${currentQuestion + 1}`
    );

    if (questionExists) {
      console.log(
        `Question${currentQuestion + 1} already exists in saveSelected`
      );
      console.log(
        "Selected answer: " +
          selectedAnswer +
          " current: " +
          (currentQuestion + 1)
      );
      const updatedSaveSelected = saveSelected.filter(
        (answer) =>
          Object.keys(answer)[0] !== `Question${currentQuestion + 1}` &&
          Object.keys(answer)[0] !== "result"
      );

      setSaveSelected([
        ...updatedSaveSelected,
        {
          [`Question${currentQuestion + 1}`]: selectedAnswer,
          result: checkResult(),
        },
      ]);
    } else {
      if (selectedAnswer === currentQuizQuestion.correctAnswer) {
        dispatch(setScore(score + 1));
      }
      setSaveSelected((prevSelected) => [
        ...prevSelected,
        {
          [`Question${currentQuestion + 1}`]: selectedAnswer,
          result: checkResult(),
        },
      ]);
    }

    const previousSelectedAnswer = selectedAnswer;

    dispatch(setCurrentQuestion(data.length - 1));

    if (currentQuestion !== currentQuizQuestion.length - 1) {
      dispatch(setSelectedAnswer(null));
      const nextQuestion = saveSelected.find(
        (item) => Object.keys(item)[0] === `Question${currentQuestion + 2}`
      );
      if (nextQuestion) {
        const nextAnswer = nextQuestion[`Question${currentQuestion + 2}`];
        dispatch(setSelectedAnswer(nextAnswer));
      }
    } else {
      dispatch(setSelectedAnswer(previousSelectedAnswer));
    }
  };

  const handleSubmit = () => {
    const data = saveSelected;
    navigate(`/review/${id}`, { state: { data } });
  };

  const handleReview = () => {
    const data = saveSelected;
    navigate("/result", { state: { data } });
  };

  if (!data) return null;

  if (showResult) {
    return (
      <div>
        <h1>Quiz Completed!</h1>
        <p>Your score: {score}</p>
      </div>
    );
  }

  const currentQuizQuestion = data[currentQuestion];
  const selectedAnswerForQuestion = saveSelected.find(
    (item) => Object.keys(item)[0] === `Question${currentQuestion + 1}`
  );
  const selectedAnswerValue = selectedAnswerForQuestion
    ? selectedAnswerForQuestion[`Question${currentQuestion + 1}`]
    : selectedAnswer;

  return (
    <div>
      <Container>
        <h1
          style={{
            backgroundColor: "black",
            color: "white",
            textAlign: "center",
            padding: "30px",
          }}
        >
          {detailClassByID?.data.nameClass}
        </h1>
        <Row>
          <h5 className="text-xl py-4">
            Q.{currentQuestion + 1} {currentQuizQuestion.question}
          </h5>
        </Row>
        <Row className="">
          {currentQuizQuestion.answers.map((answer, index) => (
            <Col key={index} xs={6}>
              <li
                className="p-3 rounded-3 border border-info text-xl"
                style={{ listStyleType: "none", backgroundColor: "#c9dfff" }}
              >
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value={answer}
                    checked={
                      selectedAnswerValue === answer ||
                      selectedAnswer === answer
                    }
                    onChange={() => handleAnswerSelect(answer)}
                  />
                  {answer}
                </label>
              </li>
              <br />
            </Col>
          ))}
        </Row>
        <QuizzContext.Provider
          value={{
            handleFirstQuestion,
            handlePrevQuestion,
            handleNextQuestion,
            handleLastQuestion,
            data,
            currentQuestion,
            saveSelected,
          }}
        >
          <div style={{ marginTop: "20px" }}>
            <Directional />
          </div>
        </QuizzContext.Provider>
        <Row>
          <Col xs={4} className="d-flex justify-content-center pt-4 pb-4">
            <button
              className="btn btn-primary m-2"
              onClick={handleFirstQuestion}
              disabled={currentQuestion === 0}
            >
              Quiz
            </button>
            <button
              className="btn btn-primary m-2"
              onClick={handleReview}
              disabled={currentQuestion === 0}
            >
              Quiz Review
            </button>
            <button className="btn btn-primary m-2" onClick={handleSubmit}>
              Submit
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Quiz;
