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
import { useSaveSelected } from "../../redux/QuizState";
import { useQuery } from "@tanstack/react-query";
import * as TestService from "../../services/TestService";
import CountdownCircle from "../../components/CoutdownComponent/CountdownCircle";

export const QuizzContext = createContext();
export const quizData = [];

const QuizTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saveSelected, setSaveSelected] = useSaveSelected();
  const [progress, setProgress] = useState("0%");
  const [timeCountdown, setTimecountdown] = useState(5);
  const [assignment, setAssignment] = useState("assignment");
  const { id } = useParams();

  const getDetailTest = (id) => async () => {
    const res = await TestService.getDetailTest(id);
    return res;
  };

  const {
    data: detailTestByID,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["detailTestByID", id],
    queryFn: getDetailTest(id),
  });

  const dispatch = useDispatch();
  const { currentQuestion, selectedAnswer, score, showResult, data, error } =
    useSelector((state) => state.quiz);
  console.log("Current question", currentQuestion + 1);

  console.log("selected answer :" + selectedAnswer);

  useEffect(() => {
    const savedData = location.state?.saveSelected;
    if (savedData) {
      setSaveSelected(savedData);
    }
  }, [location.state, setSaveSelected]);

  useEffect(() => {
    if (detailTestByID && detailTestByID?.data.questionsTest) {
      dispatch(setData(detailTestByID?.data.questionsTest));
      setTimecountdown(detailTestByID.data.timeTest); // Set timeCountdown to timeTest value
    }
  }, [detailTestByID, dispatch]);

  useEffect(() => {
    if (data) {
      const initialSaveSelected = data.map((_, index) => ({
        [`Question${index + 1}`]: null,
        result: false,
      }));
      setSaveSelected(initialSaveSelected);
    }
  }, [data]);
  console.log("Cau cuoi", data);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimecountdown((prevTime) => {
        if (prevTime === 0) {
          console.log(currentQuestion);
          if (currentQuestion + 1 === data?.length) {
            console.log("Da vao`");
            handleSubmit();
          } else {
            handleNextQuestion();
            return detailTestByID.data.timeTest;
          }
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion, selectedAnswer]);

  if (error) return <div>Error: {error}</div>;
const handleAnswerSelect = (answer) => {
    dispatch(setSelectedAnswer(answer));
const questionKey = `Question${currentQuestion + 1}`;
    const isCorrect = checkResult(answer);

    setSaveSelected((prevSelected) =>
      prevSelected.map((selected) =>
        Object.keys(selected)[0] === questionKey
          ? { ...selected, [questionKey]: answer, result: isCorrect }
          : selected
      )
    );

    if (isCorrect) {
      dispatch(setScore(score + 1));
    }
  };

  console.log("score", score);

  const checkResult = (answer) => {
    return answer === currentQuizQuestion?.correctAnswer;
  };

  const handleNextQuestion = () => {
    const previousSelectedAnswer = selectedAnswer;

    dispatch(setCurrentQuestion(currentQuestion + 1));

    if (currentQuestion !== currentQuizQuestion?.length - 1) {
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
      if (selectedAnswer === currentQuizQuestion?.correctAnswer) {
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
    navigate(`/review/${assignment}/${id}`, { state: { data } });
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

  // console.log("detail Tétttt",detailTestByID.data)
  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="relative bg-yellow-400 text-blue-800 text-center py-12 text-3xl font-bold rounded-lg shadow-lg">
  {detailTestByID?.data.iDTest}
  <div className="countdown-container absolute inset-0 flex items-center justify-end pr-4">
    <CountdownCircle duration={timeCountdown} />
  </div>
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
      </div>
    </div>
  );
};

export default QuizTest;