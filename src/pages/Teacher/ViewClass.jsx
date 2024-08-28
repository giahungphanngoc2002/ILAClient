import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as ClassService from "../../services/ClassService";
import * as TestService from "../../services/TestService";
import * as UserService from "../../services/UserService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "react-bootstrap";
import * as message from "../../components/MessageComponent/Message";
import { data } from "autoprefixer";
import { toast } from "react-toastify";
import ManageQuestion from "../Manage/ManageQuestion";
import ManageHistory from "../Manage/ManageHistory";
import ManageStudent from "../Manage/ManageStudent";
import ManageTest from "../Manage/ManageTest";
import ModalUpdate from "../Modal/ModalUpdate";
import ModalCreateTest from "../Modal/ModalCreateTest";
import ModalAddQuestionToTestModal from "../Modal/ModalAddQuestionToTestModal";
import ModalAddNewStudent from "../Modal/ModalAddNewStudent";
import { useMutationHooks } from "../../hooks/useMutationHook";

// Add all icons to library
library.add(fas);

const ViewClass = () => {
  const { id, studentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [histories, setHistories] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filteredQuestion, setFilteredQuestion] = useState(null); // Use a single object for the filtered question
  // const [filtere]
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  const [showAddQuestionToTestModal, setShowAddQuestionToTestModal] =
    useState(false);
  const [showAddNewStudentModal, setShowAddNewStudentModal] = useState(false);
  const [toggleEditQuestion, setToggleEditQuestion] = useState(false);
  const [toggleEditLevel, setToggleEditLevel] = useState(false);
  const [toggleEditCA, setToggleEditCA] = useState(false);
  const [textQuestion, setTextQuestion] = useState("");
  const [editingAnswerIndex, setEditingAnswerIndex] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [textCA, setTextCA] = useState("");
  const [textLevel, setTextLevel] = useState("");
  const [tests, setTests] = useState([]);
  const [testId, setTestId] = useState("");
  const [testID, setTestID] = useState("");
  const [password, setPassword] = useState("");
  const [time, setTime] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [activeTab, setActiveTab] = useState("questions");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState(filter);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const onSelectOption = (value, option) => {
    setSelectedValue(value);
    setInputValue(value); // Set input value to selected value
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    onSearch(value); // Perform search when input changes
  };

  const { mutate: addStudentToClass } = useMutationHooks(
    ({ classId, studentId }) =>
      ClassService.addStudentIDToClass(classId, studentId)
  );

  const handleAddStudentToClass = async () => {
    try {
      await addStudentToClass({ classId: id, studentId: selectedValue });
      toast.success("Student added successfully");
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student");
    }
    handleCloseAddNewStudentModal();
  };
  const deleteStudentIdMutation = useMutation({
    mutationFn: ({ classId: id, studentId: selectedValue }) =>
      ClassService.deleteStudentIDToClass(id, selectedValue),
    onSuccess: () => {
      queryClient.invalidateQueries(["allclass1", id]);
    },
  });

  useEffect(() => {
    if (deleteStudentIdMutation.isSuccess) {
      toast.success("Student deleted successfully");
    }
  }, [deleteStudentIdMutation.isSuccess]);

  const getAllTopUser = async () => {
    const res = await UserService.getAllTopUser();
    return res;
  };

  const { data: searchUser } = useQuery({
    queryKey: ["searchUser"],
    queryFn: getAllTopUser,
  });

  const GetDetailsClass = async (id) => {
    const res = await ClassService.getDetailClass(id);
    return res;
  };

  const getAllUser = async () => {
    const res = await UserService.getAllUser();
    return res;
  };

  const { data: allUser } = useQuery({
    queryKey: ["allUser"],
    queryFn: getAllUser,
  });

  const getHistoryClass = async (id) => {
    const res = await ClassService.getHistoryClass(id);
    return res;
  };

  const { data: allHistoryClass } = useQuery({
    queryKey: ["allHistoryClass", id],
    queryFn: () => getHistoryClass(id),
  });

  useEffect(() => {
    if (allHistoryClass) {
      setHistories(allHistoryClass.data);
    }
  }, [allHistoryClass]);

  useEffect(() => {
    if (allUser & allUser?.data) {
      setListUser(allUser?.data);
    }
  }, [allUser]);

  const {
    data: allclass1,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allclass1", id],
    queryFn: () => GetDetailsClass(id),
  });

  useEffect(() => {
    if (allclass1 && allclass1.data.questions) {
      setQuestions(allclass1.data.questions);
    }
  }, [allclass1]);

  useEffect(() => {
    if (allclass1 && allclass1.data.tests) {
      setTests(allclass1.data.tests);
    }
  }, [allclass1]);

  const createTestMutation = useMutation({
    mutationFn: ({ classId, testData }) =>
      ClassService.addTest(classId, testData),
    onSuccess: () => {
      queryClient.invalidateQueries(["allclass1", id]);
      toast.success("Test created successfully");
      setShowCreateTestModal(false);
    },
    onError: () => {
      toast.error("Failed to create test");
    },
  });

  const addQuestionToTestMutation = useMutation({
    mutationFn: async ({ testId, questionData, timeTest }) => {
      const response = await TestService.addQuestionByTestId(testId, questionData, timeTest);
      return response;
    },
    onSuccess: (response) => {
      if (response.status === "ERR") {
        toast.error(response.message || "Failed to add question to test");
      } else {
        queryClient.invalidateQueries(["allclass1", id]);
        toast.success("Question added to test successfully");
        setShowAddQuestionToTestModal(false);
      }
    },
    onError: () => {
      toast.error("Failed to add question to test");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ classId, questionId }) =>
      ClassService.deleteQuestionById(classId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["allclass1", id]);
    },
  });

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      toast.success("Question deleted successfully");
    }
  }, [deleteMutation.isSuccess]);

  const deleteTestMutation = useMutation({
    mutationFn: ({ id }) => TestService.deleteTestByID(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["allclass1", id]);
    },
  });

  useEffect(() => {
    if (deleteTestMutation.isSuccess) {
      toast.success("Test deleted successfully");
    }
  }, [deleteTestMutation.isSuccess]);

  const deleteTestByID = (id) => {
    deleteTestMutation.mutate({ id });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestions(questions.map((question) => question._id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const updateMutation = useMutation({
    mutationFn: ({ classId, questionId, updatedQuestion }) =>
      ClassService.updateQuestionById(classId, questionId, updatedQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries(["allclass1", id]);
      toast.success("Question updated successfully");
      setShowUpdateModal(false);
    },
    onError: () => {
      toast.error("Failed to update question");
    },
  });

  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelectedQuestions([...selectedQuestions, id]);
    } else {
      setSelectedQuestions(
        selectedQuestions.filter((questionId) => questionId !== id)
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  const handleOpenUpdateModal = (id) => {
    const filteredQuestions = questions.find((question) => question._id === id);
    setFilteredQuestion(filteredQuestions);
    setTextQuestion(filteredQuestions.question);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setFilteredQuestion(null);
    setShowUpdateModal(false);
  };

  const handleCloseCreateTestModal = () => {
    setShowCreateTestModal(false);
  };

  const handleCloseAddQuestionToTestModal = () => {
    setShowAddQuestionToTestModal(false);
  };

  const handleCloseAddNewStudentModal = () => {
    setShowAddNewStudentModal(false);
  };

  const deleteQuestionByID = (questionId) => {
    deleteMutation.mutate({ classId: id, questionId });
  };
  const deleteStudentByID = (studentId) => {
    deleteStudentIdMutation.mutate({ classId: id, studentId });
  };

  const handleEditQuestionn = (question) => {
    setTextQuestion(question);
    setToggleEditQuestion(!toggleEditQuestion);
  };

  const handleEditCA = () => {
    setToggleEditCA(!toggleEditCA);
  };

  const handleEditLevel = () => {
    setToggleEditLevel(!toggleEditLevel);
  };


  const handleQuestionChange = (e) => {
    setTextQuestion(e.target.value);
  };

  const handleCorrectAnswerChange = (e) => {
    setTextCA(e.target.value);
  };

  const handleLevelChange = (e) => {
    setTextLevel(e.target.value);
  };

  const saveQuestion = () => {
    setFilteredQuestion((prev) => ({
      ...prev,
      question: textQuestion,
    }));
    setToggleEditQuestion(!toggleEditQuestion);
  };

  const saveLevel = () => {
    setFilteredQuestion((prev) => ({
      ...prev,
      level: textLevel,
    }));
    setToggleEditLevel(!toggleEditLevel);
  };

  const saveCorrectQuestion = () => {
    setFilteredQuestion((prev) => ({
      ...prev,
      correctAnswer: textCA,
    }));
    setToggleEditCA(!toggleEditCA);
  };

  const handleEditAnswer = (index, answer) => {
    setEditingAnswerIndex(index);
    setTextAnswer(answer);
  };

  const handleAnswerChange = (e) => {
    setTextAnswer(e.target.value);
  };

  const saveAnswer = () => {
    const updatedAnswers = [...filteredQuestion.answers];
    updatedAnswers[editingAnswerIndex] = textAnswer;
    setFilteredQuestion((prev) => ({
      ...prev,
      answers: updatedAnswers,
    }));
    setEditingAnswerIndex(null);
    setTextAnswer("");
  };
  const handleUpdateQuestion = () => {
    const updatedQuestion = {
      question: textQuestion,
      correctAnswer: filteredQuestion.correctAnswer,
      answers: filteredQuestion.answers,
      level:filteredQuestion.level,
    };
    updateMutation.mutate({
      classId: id,
      questionId: filteredQuestion._id,
      updatedQuestion,
    });
  };

  const viewReview = (id) => {
    navigate(`/detailHistory/${id}`);
  };
  const viewReviewAssigment = (selectedTest) => {
    navigate(`/detailAssigment/${selectedTest}`);
  };

  const handleOpenCreateTestModal = () => {
    setShowCreateTestModal(true);
  };

  const handleOnchangeTestID = (e) => {
    setTestID(e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleOnchangeTimeStart = (e) => {
    setTimeStart(e.target.value);
  }

  const handleOnchangeTimeEnd = (e) => {
    setTimeEnd(e.target.value);
  }

  const handleOnchangeTime = (e) => {
    setTime(e.target.value);
  };
  const filteredQuestionToAdd = (questions, selected) => {
    const selectedIds = new Set(selected);
    return questions.filter((question) => selectedIds.has(question._id));
  };

  const result = filteredQuestionToAdd(questions, selectedQuestions);

  const handleCreateTest = () => {
    const testData = {
      iDTest: testID,
      passwordTest: password,
      timeStart:timeStart,
      timeEnd:timeEnd,
    };
    createTestMutation.mutate({ classId: id, testData });
  };

  const handleCreateQuestionByTestId = () => {
    const questionData = result;
    const testId = selectedTest;
    const timeTest = time;
    addQuestionToTestMutation.mutate({ testId, questionData, timeTest });
  };

  const handleOpenAddQuestionToTestModal = () => {
    setShowAddQuestionToTestModal(true);
  };

  const handleOpenAddNewStudentModal = () => {
    setShowAddNewStudentModal(true);
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    setSelectedTestId(selectedId);
    setSelectedTest(selectedId);

    const selectedTest = tests.find((test) => test._id === selectedId);
    if (selectedTest) {
      setTime(selectedTest.timeTest || "");
    } else {
      setTime("");
    }
  };

  const handleSelectChangeType = (event) => {
    const value = event.target.value;
    setSelectedFilter(value);
    handleFilterChange(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const uniqueIds = new Set();

  const uniqueStudents = [];

  allclass1.data.historyID.forEach((history) => {
    const studentId = history.studentID._id;

    if (!uniqueIds.has(studentId)) {
      uniqueIds.add(studentId);
      uniqueStudents.push(history.studentID);
    }
  });

  const handleOpenAllQuestion = (id) => {
    navigate(`/detailTest/${id}`);
  };

  const filteredTestttt = allclass1.data.tests
    .filter((test) => test.historyTest && test.historyTest.length > 0)
    .map((test) => {
      const modifiedHistoryTest = test.historyTest.map((history) => ({
        ...history,
        isAssignment: true,
        iDTest: test.iDTest,
      }));
      return modifiedHistoryTest;
    });

  const combinedHistories = [...allclass1.data.historyID];

  filteredTestttt.forEach((testHistory) => {
    combinedHistories.push(...testHistory);
  });

  const filteredHistories =
    filter === "All"
      ? combinedHistories
      : combinedHistories.filter((history) => {
          return filter === "Learning"
            ? !history.isAssignment
            : history.isAssignment;
        });

  const sortedHistories = filteredHistories.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistories = sortedHistories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(sortedHistories.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onSearch = (value) => {
    const term = value.trim();
    setSearchTerm(term);

    const filteredClass = allUser.data?.filter(
      (item) =>
        item.email?.toLowerCase().includes(term.toLowerCase()) ||
        item.name?.toLowerCase().includes(term) ||
        item._id?.toLowerCase().includes(term)
    );

    setSearchData(filteredClass);
  };

  const options =
    searchData?.map((item) => ({
      value: item._id,
      label: (
        <div className="w-full flex items-center py-2 px-4 bg-gray shadow-md hover:bg-gray-100 rounded-lg transition duration-200 ease-in-out">
          <h1 className="text-sm font-semibold text-gray-900 flex-grow">
            {item.name} - {item.email} -{" "}
            <span className="text-gray-600">{item._id}</span>
          </h1>
        </div>
      ),
    })) || [];

  const handleTextSearchChange = (e) => {
    setTextSearch(e.target.value);
  };

  const filteredQuestionBySearch = questions.filter((question) =>
    question.question.toLowerCase().includes(textSearch.toLowerCase())
  );

  const handleSelectChangeeee = (e) => {
    const selectedId = e.target.value;
    setSelectedTestId(selectedId);

    const selectedTest = tests.find((test) => test._id === selectedId);
    if (selectedTest) {
      setTime(selectedTest.timeTest || "");
    } else {
      setTime("");
    }
  };

  const handleOnchangeTimeeee = (e) => {
    setTime(e.target.value);
  };

  console.log(timeEnd, timeStart)

  return (
    <div className="main-content p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  {activeTab === "questions"
                    ? "Manage Questions"
                    : activeTab === "history"
                    ? "Manage History"
                    : "Manage Test"}
                </h2>
                <div className="flex space-x-2">
                  {activeTab === "questions" && (
                    <button
                      onClick={handleOpenAddQuestionToTestModal}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center shadow-md"
                    >
                      <FontAwesomeIcon icon="plus" />
                      <span className="ml-2">Add To Test</span>
                    </button>
                  )}
                  {activeTab === "questions" && (
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center shadow-md">
                      <FontAwesomeIcon icon="trash" />
                      <span className="ml-2">Delete</span>
                    </button>
                  )}
                  {activeTab === "test" && (
                    <button
                      onClick={handleOpenCreateTestModal}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center shadow-md"
                    >
                      <FontAwesomeIcon icon="plus" />

                      <span className="ml-2">Add New Test</span>
                    </button>
                  )}
                  {activeTab === "test" && (
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center shadow-md">
                      <FontAwesomeIcon icon="trash" />
                      <span className="ml-2">Delete</span>
                    </button>
                  )}
                  {activeTab === "student" && (
                    <button
                      onClick={handleOpenAddNewStudentModal}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center shadow-md"
                    >
                      <FontAwesomeIcon icon="plus" />

                      <span className="ml-2">Add New Student</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  className={`px-4 py-2 rounded-lg focus:outline-none ${
                    activeTab === "questions"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setActiveTab("questions")}
                >
                  Manage Questions
                </button>
                <button
                  className={`px-4 py-2 rounded-lg focus:outline-none ${
                    activeTab === "history"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  Manage History
                </button>
                <button
                  className={`px-4 py-2 rounded-lg focus:outline-none ${
                    activeTab === "test"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setActiveTab("test")}
                >
                  Manage Test
                </button>
                <button
                  className={`px-4 py-2 rounded-lg focus:outline-none ${
                    activeTab === "student"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setActiveTab("student")}
                >
                  Manage Student
                </button>
                {activeTab === "questions" && (
                  <input
                    type="text"
                    value={textSearch}
                    onChange={handleTextSearchChange}
                    className="border rounded-lg px-2 py-1"
                    placeholder="Search question"
                    style={{ marginLeft: "auto" }}
                  />
                )}
                {activeTab === "history" && (
                  <select
                    className="border rounded-lg px-2 py-1"
                    style={{ marginLeft: "auto" }}
                    value={selectedFilter}
                    onChange={handleSelectChangeType}
                  >
                    <option value="All">All</option>
                    <option value="Learning">Learning</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                )}
              </div>
            </div>
            {activeTab === "questions" ? (
              <ManageQuestion
                questions={filteredQuestionBySearch}
                selectedQuestions={selectedQuestions}
                handleSelectAll={handleSelectAll}
                handleSelect={handleSelect}
                handleOpenUpdateModal={handleOpenUpdateModal}
                deleteQuestionByID={deleteQuestionByID}
                handleOpenAddQuestionToTestModal={
                  handleOpenAddQuestionToTestModal
                }
              />
            ) : activeTab === "history" ? (
              <ManageHistory
                currentHistories={currentHistories}
                viewReview={viewReview}
                viewReviewAssigment={viewReviewAssigment}
                indexOfFirstItem={indexOfFirstItem}
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            ) : activeTab === "test" ? (
              <ManageTest
                selectedQuestions={selectedQuestions}
                handleSelectAll={handleSelectAll}
                handleSelect={handleSelect}
                deleteQuestionByID={deleteQuestionByID}
                questions={questions}
                allclass1={allclass1}
                handleOpenAllQuestion={handleOpenAllQuestion}
                deleteTestByID={deleteTestByID}
              />
            ) : activeTab === "student" ? (
              <ManageStudent
                uniqueStudents={allclass1?.data.studentID}
                handleOpenUpdateModal={handleOpenUpdateModal}
                deleteStudentByID={deleteStudentByID}
              />
            ) : null}
          </div>
        </div>
      </div>
      {showUpdateModal && (
        <ModalUpdate
          showUpdateModal={showUpdateModal}
          handleCloseUpdateModal={handleCloseUpdateModal}
          filteredQuestion={filteredQuestion}
          toggleEditQuestion={toggleEditQuestion}
          textQuestion={textQuestion}
          handleQuestionChange={handleQuestionChange}
          saveQuestion={saveQuestion}
          saveLevel={saveLevel}
          handleEditQuestionn={handleEditQuestionn}
          toggleEditCA={toggleEditCA}
          textCA={textCA}
          textLevel={textLevel}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
          handleLevelChange= {handleLevelChange}
          saveCorrectQuestion={saveCorrectQuestion}
          handleEditCA={handleEditCA}
          editingAnswerIndex={editingAnswerIndex}
          textAnswer={textAnswer}
          handleAnswerChange={handleAnswerChange}
          saveAnswer={saveAnswer}
          handleEditAnswer={handleEditAnswer}
          handleUpdateQuestion={handleUpdateQuestion}
          toggleEditLevel={toggleEditLevel}
          handleEditLevel={handleEditLevel}
        />
      )}
      {showCreateTestModal && (
        <ModalCreateTest
          showCreateTestModal={showCreateTestModal}
          handleCloseCreateTestModal={handleCloseCreateTestModal}
          handleOnchangeTestID={handleOnchangeTestID}
          testID={testID}
          handleOnchangePassword={handleOnchangePassword}
          password={password}
          handleCreateTest={handleCreateTest}
          timeEnd={timeEnd}
          timeStart={timeStart}
          handleOnchangeTimeEnd={handleOnchangeTimeEnd}
          handleOnchangeTimeStart={handleOnchangeTimeStart}
        />
      )}
      {showAddQuestionToTestModal && (
        <ModalAddQuestionToTestModal
          showAddQuestionToTestModal={showAddQuestionToTestModal}
          handleCloseAddQuestionToTestModal={handleCloseAddQuestionToTestModal}
          handleSelectChange={handleSelectChange}
          tests={tests}
          handleOnchangeTime={handleOnchangeTime}
          time={time}
          handleCreateQuestionByTestId={handleCreateQuestionByTestId}
          handleSelectChangeeee={handleSelectChangeeee}
          handleOnchangeTimeeee={handleOnchangeTimeeee}
        />
      )}
      {showAddNewStudentModal && (
        <ModalAddNewStudent
          showAddNewStudentModal={showAddNewStudentModal}
          handleCloseAddNewStudentModal={handleCloseAddNewStudentModal}
          onSearch={onSearch}
          options={options}
          handleSelectChange={handleSelectChange}
          onSelectOption={onSelectOption}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleAddStudentToClass={handleAddStudentToClass}
        />
      )}
    </div>
  );
};

export default ViewClass;
