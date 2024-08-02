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
  const [progress, setProgress] = useState("0%");
  const [learning, setLearning] = useState("learning");
  const [checkedQuestions, setCheckedQuestions] = useState(0);
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

  const dispatch = useDispatch();
  const { currentQuestion, selectedAnswer, score, showResult, data, error } =
    useSelector((state) => state.quiz);

  useEffect(() => {
    const savedData = location.state?.saveSelected;
    if (savedData) {
      setSaveSelected(savedData);
    }
  }, [location.state, setSaveSelected]);

  useEffect(() => {
    if (detailClassByID && detailClassByID.data) {
      dispatch(setData(detailClassByID.data.questions));
    }
  }, [detailClassByID, dispatch]);

  useEffect(() => {
    if (data) {
      const initialSaveSelected = data.map((_, index) => ({
        [`Question${index + 1}`]: null,
        result: false,
      }));
      setSaveSelected(initialSaveSelected);
    }
  }, [data]);

  useEffect(() => {
    let selectedCount = 0;

    saveSelected.forEach((question) => {
      const questionKey = Object.keys(question)[0];
      const questionValue = question[questionKey];

      if (questionValue !== null) {
        selectedCount++;
      }
    });
    setCheckedQuestions(selectedCount);
    console.log("saveSelected: ", selectedCount);
    console.log("saveSelected: ", saveSelected)
    const countProgress = (selectedCount / data?.length) * 100 + "%";
    setProgress(countProgress);
  }, [saveSelected]);

  if (isError) return <div>Error: {error}</div>;

  const handleAnswerSelect = (answer) => {
    dispatch(setSelectedAnswer(answer));

    const questionKey = `Question${currentQuestion + 1}`;
    const questionExists = saveSelected.some(
      (selected) => Object.keys(selected)[0] === questionKey
    );

    if (questionExists) {
console.log(`${questionKey} already exists in saveSelected`);
      const updatedSaveSelected = saveSelected.filter(
        (selected) =>
          Object.keys(selected)[0] !== questionKey &&
          Object.keys(selected)[0] !== "result"
      );

      setSaveSelected([
        ...updatedSaveSelected,
        {
          [questionKey]: answer,
          result: checkResult(answer),
        },
      ]);
    } else {
      if (answer === currentQuizQuestion.correctAnswer) {
        dispatch(setScore(score + 1));
      }
      setSaveSelected((prevSelected) => [
        ...prevSelected,
        {
          [questionKey]: answer,
          result: checkResult(answer),
        },
      ]);
    }
  };

  const handleNextQuestion = () => {
    const previousSelectedAnswer = selectedAnswer;

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
      dispatch(setSelectedAnswer(previousSelectedAnswer));
    }

    // const countProgress = ((currentQuestion + 1) / data.length) * 100 + "%";
    // setProgress(countProgress);
  };

  const checkResult = (answer) => {
    if (answer === currentQuizQuestion.correctAnswer) {
      dispatch(setScore(score + 1));
      return true;
    } else {
      return false;
    }
  };

  const handlePrevQuestion = () => {
    const previousSelectedAnswer = selectedAnswer;

    dispatch(setCurrentQuestion(currentQuestion - 1));

    if (currentQuestion > 0) {
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

    // var countProgress = ((currentQuestion - 1) / data.length) * 100 + "%";
    // setProgress(countProgress);
  };

  const handleFirstQuestion = () => {
    const previousSelectedAnswer = selectedAnswer;

    dispatch(setCurrentQuestion(0));
    dispatch(setSelectedAnswer(null));
    const firstQuestion = saveSelected.find(
      (item) => Object.keys(item)[0] === `Question1`
    );
    if (firstQuestion) {
      const firstAnswer = firstQuestion[`Question1`];
      dispatch(setSelectedAnswer(firstAnswer));
    } else {
      dispatch(setSelectedAnswer(previousSelectedAnswer));
    }

    // var countProgress = (1 / data.length) * 100 + "%";
    // setProgress(countProgress);
  };

  const handleLastQuestion = () => {
const previousSelectedAnswer = selectedAnswer;

    dispatch(setCurrentQuestion(data.length - 1));
    dispatch(setSelectedAnswer(null));
    const lastQuestion = saveSelected.find(
      (item) => Object.keys(item)[0] === `Question${data.length}`
    );
    if (lastQuestion) {
      const lastAnswer = lastQuestion[`Question${data.length}`];
      dispatch(setSelectedAnswer(lastAnswer));
    } else {
      dispatch(setSelectedAnswer(previousSelectedAnswer));
    }

    // var countProgress = (data.length / data.length) * 100 + "%";
    // setProgress(countProgress);
  };

  const handleSubmit = () => {
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

    // Điều hướng đến trang review với dữ liệu đã cập nhật
    const data = saveSelected;
    navigate(`/review/${learning}/${id}`, { state: { data } });
  };

  // console.log("saveSelected: ", selectedCount);

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

  // console.log(saveSelected)
  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="bg-yellow-400 text-blue-800 text-center py-8 text-3xl font-bold rounded-lg">
          {detailClassByID?.data.nameClass}
        </h1>
        <div className="mt-8">
          <h5 className="text-2xl py-4 text-green-700">
            Q.{currentQuestion + 1} {currentQuizQuestion.question}
          </h5>
        </div>
        <div className="flex flex-wrap -mx-2">
          {currentQuizQuestion.answers.map((answer, index) => (
<div key={index} className="w-full sm:w-1/2 px-2 mb-4">
              <li className="p-3 bg-pink-100 rounded-lg border border-pink-300 list-none text-xl">
                <label className="flex items-center text-purple-800">
                  <input
                    type="radio"
                    name="answer"
                    value={answer}
                    checked={
                      selectedAnswerValue === answer ||
                      selectedAnswer === answer
                    }
                    onChange={() => handleAnswerSelect(answer)}
                    className="mr-2"
                  />
                  {answer}
                </label>
              </li>
            </div>
          ))}
        </div>
        <div class="progress">
          <div
            class="progress-bar"
            role="progressbar"
            style={{ width: progress }}
            aria-valuenow="75"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
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
          <div className="mt-8">
            <Directional />
          </div>
        </QuizzContext.Provider>
        <div className="flex justify-center py-8">
          <button
            className="btn btn-primary m-2 bg-green-400 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-500 transition duration-200"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;