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
import DirectionComponent from "../../components/DirectionComponent/DirectionComponent";
import { useSaveSelected } from "../../redux/QuizState";
import { useQuery } from "@tanstack/react-query";
import * as ClassService from "../../services/ClassService";
import * as TestService from "../../services/TestService";

export const QuizzContext = createContext();

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saveSelected, setSaveSelected] = useSaveSelected();
  const [progress, setProgress] = useState("0%");
  const [assignment, setAssignment] = useState("assignment");
  const [checkedQuestions, setCheckedQuestions] = useState(0);
  const { idClass, idTest } = useParams();
  const [dataQuestion, setDataQuestion] = useState([]);
  const [dataQuantityQuestion, setDataQuantityQuestion] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState([]);

  const dispatch = useDispatch(); // Move dispatch here

  const getDetailsClass = (idClass) => async () => {
    const res = await ClassService.getDetailClass(idClass);
    return res;
  };

  const getDetailsTest = (idTest) => async () => {
    const res = await TestService.getDetailTest(idTest);
    return res;
  };

  const {
    data: detailClassByID,
    error: classError,
    isLoading: isLoadingClass,
  } = useQuery({
    queryKey: ["detailClassByID", idClass],
    queryFn: getDetailsClass(idClass),
  });

  const {
    data: detailTestByID,
    error: testError,
    isLoading: isLoadingTest,
  } = useQuery({
    queryKey: ["detailTestByID", idTest],
    queryFn: getDetailsTest(idTest),
  });

  useEffect(() => {
    if (detailClassByID && detailClassByID.data) {
      setDataQuestion(detailClassByID.data.questions || []);
    }
  }, [detailClassByID]);

  useEffect(() => {
    if (detailTestByID && detailTestByID.data) {
      setDataQuantityQuestion(detailTestByID.data.quantityQuestion || 0);
    }
  }, [detailTestByID]);

  // useEffect(() => {
  //   if (dataQuestion.length > 0) {
  //     const randomQuestions = getRandomQuestions(dataQuestion, dataQuantityQuestion);
  //     dispatch(setData(randomQuestions));
  //   }
  // }, [dataQuestion, dispatch]);
  useEffect(() => {
    if (dataQuestion.length > 0 && dataQuantityQuestion > 0) {
      const randomQuestions = getRandomQuestions(dataQuestion, dataQuantityQuestion);
      dispatch(setData(randomQuestions));
    }
  }, [dataQuestion, dataQuantityQuestion, dispatch]);

  // Check if currentQuestion is valid
  // const currentQuizQuestionn = data && data[currentQuestion];
  // if (!currentQuizQuestionn) {
  //   return <p>Question not available</p>;
  // }

  const getRandomQuestions = (questions, num) => {
    if (!questions || questions.length === 0 || num <= 0) {
      return [];
    }
    if (num > questions.length) {
      throw new Error("Số lượng câu hỏi yêu cầu lớn hơn số lượng câu hỏi có sẵn.");
    }

    // Categorize questions by level
    const level1Questions = questions.filter(q => q.level === 1);
    const level2Questions = questions.filter(q => q.level === 2);
    const level3Questions = questions.filter(q => q.level === 3);

    // Calculate the number of questions required for each level
    const numLevel1 = Math.ceil(num * 0.2); // 20%
    const numLevel2 = Math.ceil(num * 0.6); // 60%
    const numLevel3 = num - numLevel1 - numLevel2; // 20% or remaining

    console.log("so luong", numLevel1, numLevel2, numLevel3)

    const getRandomSubset = (array, count) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    };

    // Randomly select questions from each level
    const selectedLevel1 = getRandomSubset(level1Questions, numLevel1);
    const selectedLevel2 = getRandomSubset(level2Questions, numLevel2);
    const selectedLevel3 = getRandomSubset(level3Questions, numLevel3);

    // Combine all selected questions
    const combinedQuestions = [
      ...selectedLevel1,
      ...selectedLevel2,
      ...selectedLevel3
    ];

    // Shuffle the final set of questions
    return getRandomSubset(combinedQuestions, num);
  };

  const { currentQuestion, selectedAnswer, score, showResult, data } = useSelector((state) => state.quiz);

  useEffect(() => {
    const savedData = location.state?.saveSelected;
    if (savedData) {
      setSaveSelected(savedData);
    }
  }, [location.state, setSaveSelected]);

  useEffect(() => {
    if (data) {
      const initialSaveSelected = data.map((_, index) => ({
        [`Question${index + 1}`]: null,
        result: false,
      }));
      setSaveSelected(initialSaveSelected);
    }
  }, [data, setSaveSelected]);

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
  }, [saveSelected, data]);

  const handleAnswerSelect = (answer) => {
    dispatch(setSelectedAnswer(answer));
    const questionKey = `Question${currentQuestion + 1}`;
    const isCorrect = checkResult(answer);

    const updatedSaveSelected = saveSelected.filter(
      (selected) => Object.keys(selected)[0] !== questionKey && Object.keys(selected)[0] !== "result"
    );

    setSaveSelected([
      ...updatedSaveSelected,
      {
        [questionKey]: answer,
        result: isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    dispatch(setCurrentQuestion(currentQuestion + 1));
    dispatch(setSelectedAnswer(null));

    const nextQuestion = saveSelected.find(
      (item) => Object.keys(item)[0] === `Question${currentQuestion + 2}`
    );
    if (nextQuestion) {
      const nextAnswer = nextQuestion[`Question${currentQuestion + 2}`];
      dispatch(setSelectedAnswer(nextAnswer));
    }
  };

  const checkResult = (answer) => {
    if (answer === data[currentQuestion]?.correctAnswer) {
      return true;
    }
    return false;
  };

  const handlePrevQuestion = () => {
    dispatch(setCurrentQuestion(currentQuestion - 1));
    dispatch(setSelectedAnswer(null));

    const prevQuestion = saveSelected.find(
      (item) => Object.keys(item)[0] === `Question${currentQuestion}`
    );
    if (prevQuestion) {
      const prevAnswer = prevQuestion[`Question${currentQuestion}`];
      dispatch(setSelectedAnswer(prevAnswer));
    }
  };

  const handleFirstQuestion = () => {
    dispatch(setCurrentQuestion(0));
    dispatch(setSelectedAnswer(null));

    const firstQuestion = saveSelected.find(
      (item) => Object.keys(item)[0] === `Question1`
    );
    if (firstQuestion) {
      const firstAnswer = firstQuestion[`Question1`];
      dispatch(setSelectedAnswer(firstAnswer));
    }
  };

  const handleLastQuestion = () => {
    dispatch(setCurrentQuestion(data.length - 1));
    dispatch(setSelectedAnswer(null));

    const lastQuestion = saveSelected.find(
      (item) => Object.keys(item)[0] === `Question${data.length}`
    );
    if (lastQuestion) {
      const lastAnswer = lastQuestion[`Question${data.length}`];
      dispatch(setSelectedAnswer(lastAnswer));
    }
  };

  const handleSubmit = () => {
    const questionExists = saveSelected.some(
      (answer) => Object.keys(answer)[0] === `Question${currentQuestion + 1}`
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
        result: checkResult(selectedAnswer),
      },
    ]);

    navigate(`/review/${assignment}/${idTest}`, { state: { data: saveSelected } });
  };

  if (isLoadingClass || isLoadingTest) return <p>Loading...</p>;
  if (classError || testError) return <p>Error: {classError?.message || testError?.message}</p>;
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

  const handleQuestionClick = (index) => {
    dispatch(setCurrentQuestion(index));
  };

  return (
    <div className="w-screen h-screen p-4 bg-gray-50 flex">
      {/* Nội dung chính của câu hỏi */}
      <div className="w-3/4 pr-4">
        <div className="mt-2">
          <h5 className="text-xl mb-12 text-gray-900 font-bold">
            Q.{currentQuestion + 1} {currentQuizQuestion.question}
          </h5>
          <div className="text-gray-700 text-sm mb-4">
            Hãy chọn một đáp án đúng nhất:
          </div>
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
                  className={`p-4 rounded-lg border list-none text-lg cursor-pointer flex items-center ${isSelected
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
                </li>
              </div>
            );
          })}
        </div>
        <div className="relative mb-6 flex items-center justify-between">
          {/* Nút trái hiển thị số 0 */}
          <div className="flex items-center justify-center w-10 h-10 border border-blue-400 rounded-full">
            <span className="text-black">{checkedQuestions}</span>
          </div>

          {/* Thanh progress */}
          <div className="flex-1 mx-4">
            <div className="relative w-full h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                style={{ width: progress }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-center w-10 h-10 border border-blue-400 rounded-full">
            <span className="text-black">{data?.length}</span>
          </div>
        </div>
        <div className="mt-6">
          <DirectionComponent
            handleFirstQuestion={handleFirstQuestion}
            handlePrevQuestion={handlePrevQuestion}
            handleLastQuestion={handleLastQuestion}
            handleNextQuestion={handleNextQuestion}
            data={data}
            currentQuestion={currentQuestion}
          />
        </div>
        <div className="flex justify-center py-6">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-600 transition duration-200"
            onClick={handleSubmit}
          >
            Nộp bài
          </button>
        </div>
      </div>

      {/* Bảng điều khiển câu hỏi */}
      <div className="w-1/4 pl-4 bg-white rounded-xl shadow-lg p-0">
        <h2 className="text-2xl font-semibold text-center bg-gray-200 py-3 rounded-t-xl">
          Danh sách câu hỏi
        </h2>
        <div className="grid grid-cols-4 gap-2 p-4">
          {data.map((question, index) => {
            const isAnswered = saveSelected.some(
              (selected) => selected[`Question${index + 1}`]
            );
            return (
              <div
                key={index}
                className={`w-12 h-12 cursor-pointer text-center rounded-lg border flex flex-col justify-center items-center ${currentQuestion === index
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  }`}
                onClick={() => handleQuestionClick(index)}
              >
                <span className="text-xs font-medium">Câu {index + 1}</span>
                {isAnswered ? (
                  <span className="text-green-500 text-lg font-bold mt-1">✓</span>
                ) : (
                  <span className="text-gray-500 text-lg font-bold mt-1"> </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );


};

export default Quiz;
