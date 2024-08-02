import React, { createContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import * as ClassService from "../../services/ClassService";

export const QuizzContext = createContext();

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
    const countProgress = (selectedCount / data?.length) * 100 + "%";
    setProgress(countProgress);
  }, [saveSelected]);

  if (isError) return <div className="text-red-500">Error: {error}</div>;

  const handleAnswerSelect = (answer) => {
    dispatch(setSelectedAnswer(answer));
    const questionKey = `Question${currentQuestion + 1}`;
    const questionExists = saveSelected.some(
      (selected) => Object.keys(selected)[0] === questionKey
    );

    const isCorrect = checkResult(answer);
    if (questionExists) {
      const updatedSaveSelected = saveSelected.filter(
        (selected) =>
          Object.keys(selected)[0] !== questionKey &&
          Object.keys(selected)[0] !== "result"
      );

      setSaveSelected([
        ...updatedSaveSelected,
        {
          [questionKey]: answer,
          result: isCorrect,
        },
      ]);
    } else {
      setSaveSelected((prevSelected) => [
        ...prevSelected,
        {
          [questionKey]: answer,
          result: isCorrect,
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
  };

  const handleSubmit = () => {
    const questionExists = saveSelected.some(
      (answer) => Object.keys(answer)[0] === `Question${currentQuestion + 1}`
    );

    if (questionExists) {
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
      setSaveSelected((prevSelected) => [
        ...prevSelected,
        {
          [`Question${currentQuestion + 1}`]: selectedAnswer,
          result: checkResult(),
        },
      ]);
    }

    // Navigate to review page
    const data = saveSelected;
    navigate(`/review/${learning}/${id}`, { state: { data } });
  };

  if (!data) return null;

  if (showResult) {
    return (
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-green-500">Quiz Completed!</h1>
        <p className="text-xl mt-4">
          Your score: <span className="font-bold text-blue-500">{score}</span>
        </p>
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
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="bg-yellow-400 text-blue-800 text-center py-4 text-2xl font-bold rounded-t-lg">
        {detailClassByID?.data.nameClass}
      </h1>
      <div className="mt-6">
        <h5 className="text-xl py-4 text-green-700">
          Q.{currentQuestion + 1} {currentQuizQuestion.question}
        </h5>
      </div>
      <div className="flex flex-wrap -mx-2 mb-6">
        {currentQuizQuestion.answers.map((answer, index) => {
          const isCorrectAnswer =
            saveSelected.some(
              (selected) =>
                selected[`Question${currentQuestion + 1}`] ===
                data[currentQuestion].correctAnswer
            ) && selectedAnswer === answer;
          const isSelected = selectedAnswer === answer;
          return (
            <div key={index} className="w-full sm:w-1/2 px-2 mb-4">
              <li
                className={`p-4 rounded-lg border list-none text-lg cursor-pointer flex items-center ${
                  isCorrectAnswer
                    ? "bg-green-100 border-green-300"
                    : isSelected
                    ? "bg-red-100 border-red-300"
                    : "bg-gray-200 border-gray-300"
                }`}
                onClick={() => handleAnswerSelect(answer)}
              >
                <input
                  type="radio"
                  name="answer"
                  value={answer}
                  checked={isSelected}
                  onChange={() => handleAnswerSelect(answer)}
                  className="mr-2"
                />
                <span className="flex-1">{answer}</span>
                {isCorrectAnswer && (
                  <span className="text-green-500 text-xl ml-2">&#10004;</span> // Check mark
                )}
                {isSelected && !isCorrectAnswer && (
                  <span className="text-red-500 text-xl ml-2">&#10006;</span> // Cross mark
                )}
              </li>
            </div>
          );
        })}
      </div>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: progress }}
            ></div>
          </div>
        </div>
        {/* <div className="text-center text-sm text-gray-600">
          Progress: {progress}
        </div> */}
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
        <div className="mt-6">
          <Directional />
        </div>
      </QuizzContext.Provider>
      <div className="flex justify-center py-6">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-600 transition duration-200"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Quiz;
