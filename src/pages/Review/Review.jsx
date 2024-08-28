import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import * as ClassService from "../../services/ClassService";
import * as TestService from "../../services/TestService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/MessageComponent/Message";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Import an icon for visual appeal
import {
  setCurrentQuestion,
  setSelectedAnswer,
  setScore,
  setShowResult,
  setSaveSelected,
  setData,
  setError,
} from "../../redux/slices/quizSlice";
import { toast } from "react-toastify";

export default function Review() {
  const { currentQuestion, selectedAnswer, score, showResult, data, error } =
    useSelector((state) => state.quiz);
  const { state } = useLocation();
  const saveSelected = state ? state.data : null;
  const { assignment, id } = useParams();
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState("");
  const [isAssignment, setIsAssignment] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setUserName(user?.id);
  }, [user?.id]);

  const newArray = saveSelected
    ? saveSelected.map((item) => ({ ...item }))
    : [];

  saveSelected.sort((a, b) => {
    const questionIndexA = parseInt(Object.keys(a)[0].replace("Question", ""));
    const questionIndexB = parseInt(Object.keys(b)[0].replace("Question", ""));
    return questionIndexA - questionIndexB;
  });

  saveSelected.forEach((item) => {
    for (let key in item) {
      if (key.startsWith("Question")) {
        const newKey = "userAnswer";
        item[newKey] = item[key];
        delete item[key];
      }
    }
  });

  const finalData = [];

  if (saveSelected) {
    for (var i = 0; i < data.length; i++) {
      var newData = { ...data[i] };
      var objectFromArray2 = saveSelected[i] || {
        result: false,
        userAnswer: null,
      };
      Object.assign(newData, objectFromArray2);
      finalData.push(newData);
    }
  }
  // console.log("123123123",finalData)

  console.log("data", finalData);
  const mutation = useMutationHooks(async (data) => {
    const { score, id, userName, finalData } = data;
    const finalScore = ((score / finalData?.length) * 10).toFixed(2);
    const historyData = {
      classID: id,
      studentID: userName, // Ensure consistency in parameter names
      historyAssignment: finalData,
    };
    try {
      const result = await ClassService.addClassHistory(id, historyData);
      console.log("History created successfully", result);
    } catch (error) {
      console.error("Error creating history", error);
    }
  });
  const { mutate, isSuccess } = mutation;

  const mutation2 = useMutationHooks(async (data) => {
    const { score, id, userName, finalData } = data;
    const finalScore1 = ((score / finalData?.length) * 10).toFixed(2);
    const historyTestData = {
      testID: id,
      studentID: userName,
      point: finalScore1,
      historyAssignment: finalData,
    };
    try {
      const result = await TestService.addHistoryTest(id, historyTestData);
      console.log("History created successfully", result);
    } catch (error) {
      console.error("Error creating history", error);
    }
  });
  // console.log("soccee",finalScore)
  const { mutate: mutateAssignment, isSuccess: isSuccessAssignment } =
    mutation2;

  const { mutate: addStudentToClass } = useMutationHooks(
    ({ classId, studentId }) =>
      ClassService.addStudentIDToClass(classId, studentId)
  );

  const handleConfirmSubmit = () => {
    mutate({ score, id, userName, finalData });
    dispatch(setCurrentQuestion(0));
    dispatch(setScore(0));
    addStudentToClass({ classId: id, studentId: user.id });
  };

  const handleConfirmSubmitAssigment = () => {
    mutateAssignment({ score, id, userName, finalData });
    dispatch(setCurrentQuestion(0));
    dispatch(setScore(0));
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Submission was successful");
      navigate(`/`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessAssignment) {
      toast.success("Assignment submission was successful");
      navigate(`/`);
    }
  }, [isSuccessAssignment]);

  if (!data) return null;
  if (error) return <div>Error: {error}</div>;

  console.log(saveSelected);

  return (
    <div className="bg-gradient-to-r from-yellow-200 to-pink-200 min-h-screen p-6 flex flex-col items-center">
      <h1 className="bg-purple-500 text-white text-center py-4 px-6 rounded-full text-4xl shadow-lg">
        Quiz Review
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 w-full max-w-4xl">
        {finalData.map((questionData, questionIndex) => {
          if (questionData.userAnswer === null) {
            return null; // Skip rendering this item
          }
          return (
            <div
              key={questionIndex}
              className="bg-blue-300 rounded-lg border-4 border-blue-400 p-4 flex flex-col items-center justify-center shadow-md"
            >
              <p className="text-2xl font-bold">Q{questionIndex + 1}</p>
              {questionData.userAnswer === null ? (
                <FaTimesCircle className="text-red-500 text-3xl mt-2" />
              ) : (
                <FaCheckCircle className="text-green-500 text-3xl mt-2" />
              )}
              <p className="text-lg mt-2">Answered</p>
            </div>
          );
        })}
      </div>
      {assignment === "learning" && (
        <button
          onClick={handleConfirmSubmit}
          className="bg-red-500 text-white text-lg font-bold py-3 px-6 rounded-full mt-10 shadow-lg transform hover:scale-105 transition-transform"
        >
          Confirm and Submit Learning
        </button>
      )}
      {assignment === "assignment" && (
        <button
          onClick={handleConfirmSubmitAssigment}
          className="bg-red-500 text-white text-lg font-bold py-3 px-6 rounded-full mt-10 shadow-lg transform hover:scale-105 transition-transform"
        >
          Confirm and Submit Assignment
        </button>
      )}
    </div>
  );
}
