import React, { useEffect, useState } from "react";
import * as TestService from "../../services/TestService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ViewQuestionTest() {
  const { id } = useParams();
  const [tests, setTests] = useState([]);
  const [editedTests, setEditedTests] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const queryClient = useQueryClient();

  const getDetailsTest = async (id) => {
    const res = await TestService.getDetailTest(id);
    return res;
  };

  const { data: detailTest, isLoading, isError } = useQuery({
    queryKey: ["detailTest", id],
    queryFn: () => getDetailsTest(id),
  });

  useEffect(() => {
    if (detailTest) {
      setTests(detailTest);
      setEditedTests(detailTest.data.questionsTest);
    }
  }, [detailTest]);

  const updateMutation = useMutation({
    mutationFn: ({ testId, questionId, updatedQuestion }) =>
      TestService.updateQuestionById(testId, questionId, updatedQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries(["detailTest", id]);
      toast.success("Question updated successfully");
    },
    onError: () => {
      toast.error("Failed to update question");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ testId, questionId }) =>
      TestService.deleteQuestionById(testId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["detailTest", id]);
      toast.success("Question deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });

  const handleSaveChanges = (index) => {
    const updatedTestQuestion = {
      question: editedTests[index].question,
      correctAnswer: editedTests[index].correctAnswer,
      answers: editedTests[index].answers,
    };

    updateMutation.mutate({
      testId: id,
      questionId: editedTests[index]._id,
      updatedQuestion: updatedTestQuestion,
    });

    setEditingIndex(null);
  };

  const handleDeleteQuestion = (index) => {
    const questionId = editedTests[index]._id;

    deleteMutation.mutate({
      testId: id,
      questionId,
    });
  };

  const handleToggleEdit = (index) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  const handleInputChange = (testIndex, answerIndex, value) => {
    const updatedTests = [...editedTests];
    updatedTests[testIndex].answers[answerIndex] = value;
    setEditedTests(updatedTests);
  };

  const handleQuestionChange = (testIndex, value) => {
    const updatedTests = [...editedTests];
    updatedTests[testIndex].question = value;
    setEditedTests(updatedTests);
  };

  const handleCorrectAnswerChange = (testIndex, value) => {
    const updatedTests = [...editedTests];
    updatedTests[testIndex].correctAnswer = value;
    setEditedTests(updatedTests);
  };

  if (isLoading) {
    return <div className="text-center text-xl font-bold">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-xl font-bold text-red-500">
        Error loading data
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="bg-black text-white text-center py-6 rounded-lg text-2xl">
        {detailTest.data.iDTest}
      </h1>
      {editedTests.map((test, testIndex) => (
        <div key={testIndex} className="mt-6">
          <ul className={`p-4 rounded-lg bg-green-100 border-3 border-green-200`}>
            {editingIndex === testIndex ? (
              <input
                type="text"
                value={test.question}
                onChange={(e) => handleQuestionChange(testIndex, e.target.value)}
                className="w-full mb-2 p-2 rounded-lg border-2 border-gray-300"
              />
            ) : (
              <p className="text-lg font-semibold mb-2">{test.question}</p>
            )}
            {test.answers.map((answer, answerIndex) => (
              <li key={answerIndex} className="mb-1">
                <label className="flex items-center">
                  {editingIndex === testIndex ? (
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) =>
                        handleInputChange(testIndex, answerIndex, e.target.value)
                      }
                      className="mr-2 p-2 rounded-lg border-2 border-gray-300"
                    />
                  ) : (
                    <>
                      <input
                        type="radio"
                        value={answer}
                        checked={answer === test.userAnswer}
                        readOnly
                        className="mr-2"
                      />
                      {answer}
                    </>
                  )}
                </label>
              </li>
            ))}
            {editingIndex === testIndex ? (
              <select
                value={test.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(testIndex, e.target.value)}
                className="w-full mb-2 p-2 rounded-lg border-2 border-gray-300"
              >
                {test.answers.map((answer, answerIndex) => (
                  <option key={answerIndex} value={answer}>
                    {answer}
                  </option>
                ))}
              </select>
            ) : (
              <p className="bg-gray-200 p-2 rounded-lg border-2 border-gray-300 mt-2">
                Right answer is: <span className="font-bold">{test.correctAnswer}</span>
              </p>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              {editingIndex === testIndex ? (
                <button
                  onClick={() => handleSaveChanges(testIndex)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => handleToggleEdit(testIndex)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Edit Question
                </button>
              )}
              <button
                onClick={() => handleDeleteQuestion(testIndex)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete Question
              </button>
            </div>
          </ul>
        </div>
      ))}
    </div>
  );
}
