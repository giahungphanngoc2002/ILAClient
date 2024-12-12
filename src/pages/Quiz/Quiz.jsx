import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as SubjectService from "../../services/SubjectService";
import Direction from "../../components/Direction/Direction";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import FilterQuestionsModal from "./FilterQuestionsModal.jsx";

export const QuizzContext = createContext();

const Quiz = () => {
    const { idSubject } = useParams();

    const [dataQuestion, setDataQuestion] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [progress, setProgress] = useState("0%");
    const [saveSelected, setSaveSelected] = useState([]);
    const [checkedQuestions, setCheckedQuestions] = useState(0);
    const [errorr, setErrorr] = useState();
    const [lesson, setLesson] = useState();
    const [chapter, setChapter] = useState();
    const [level, setLevel] = useState();
    const [showModal, setShowModal] = useState(false);
    const [dataChapter, setDataChapter] = useState();
    const [initialDataQuestion, setInitialDataQuestion] = useState([]);


    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectData = await SubjectService.getDetailSubject(idSubject);
                if (subjectData) {
                    setDataQuestion(subjectData.questions);
                    setDataChapter(subjectData.chapters);
                    setInitialDataQuestion(subjectData.questions);
                } else {
                    setErrorr('Class data not found.');
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                setErrorr('Error fetching students. Please try again later.');
            }
        };

        fetchData();
    }, [idSubject]);

    useEffect(() => {
        if (dataQuestion) {
            const initialSaveSelected = dataQuestion.map((_, index) => ({
                [`Question${index + 1}`]: null,
                result: false,
            }));
            setSaveSelected(initialSaveSelected);
        }
    }, [dataQuestion]);

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
        const countProgress = (selectedCount / dataQuestion?.length) * 100 + "%";
        setProgress(countProgress);
    }, [saveSelected]);

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
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
        setCurrentQuestion(currentQuestion + 1);
    };

    const handlePrevQuestion = () => {
        setCurrentQuestion(currentQuestion - 1);
    };

    const handleFirstQuestion = () => {
        setCurrentQuestion(0);
    };

    const handleLastQuestion = () => {
        setCurrentQuestion(dataQuestion.length - 1);
    };

    const checkResult = (answer) => {
        if (answer === dataQuestion[currentQuestion].correctAnswer) {
            return true;
        } else {
            return false;
        }
    };

    // const handleChapterChange = (event) => {
    //     setSelectedChapter(event.target.value);
    // };

    const onBack = () => {
        window.history.back();
    };

    // const filteredDataQuestion = () => {
    //     return dataQuestion.filter((question) => question.chapter === selectedChapter);
    // };

    if (!dataQuestion) return null;

    const currentQuizQuestion = dataQuestion[currentQuestion];

    const openSetting = () => {
        handleOpenModal()
    }

    const handleApplyFilter = () => {
        console.log(chapter, lesson, level);

        let filteredQuestions = [...initialDataQuestion]; // Sử dụng dữ liệu gốc để filter

        filteredQuestions = filteredQuestions.filter(question => {
            // Kiểm tra từng điều kiện và chỉ lọc nếu có giá trị tương ứng
            const chapterMatch = chapter ? question.chapter === chapter : true;
            const lessonMatch = lesson ? question.lession === lesson : true;
            const levelMatch = level ? question.level[0] == level : true;

            // Trả về true nếu tất cả các điều kiện đều thỏa mãn
            return chapterMatch && lessonMatch && levelMatch;
        });

        // Cập nhật lại danh sách câu hỏi đã lọc
        setDataQuestion(filteredQuestions);
        handleCloseModal();
    };


    console.log(dataQuestion)

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <Breadcrumb
                title="Tự học"
                onBack={onBack}
                buttonText="Cài đặt"
                onButtonClick={openSetting}

            />
            <div className="container w-1/2 mx-auto p-4 bg-white rounded-lg shadow-lg">
                <div>
                    <div className="mt-2">
                        <h5 className="text-2xl text-gray-900 font-bold mb-12">
                            Q.{currentQuestion + 1} {currentQuizQuestion?.question}
                        </h5>
                        <div className="text-gray-700 text-lg mb-4">
                            Hãy chọn một đáp án đúng nhất:
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-2 mb-6">
                        {currentQuizQuestion?.options.map((answer, index) => {
                            const isCorrectAnswer =
                                saveSelected.some(
                                    (selected) =>
                                        selected[`Question${currentQuestion + 1}`] ===
                                        dataQuestion[currentQuestion].correctAnswer
                                ) && selectedAnswer === answer;
                            const isSelected = selectedAnswer === answer;

                            return (
                                <div key={index} className="w-full sm:w-1/2 px-2 mb-4">
                                    <li
                                        className={`p-4 rounded-lg border list-none text-xl cursor-pointer flex items-center transition-colors duration-200 ${isCorrectAnswer
                                            ? "bg-green-100 border-green-500"
                                            : isSelected
                                                ? "bg-red-100 border-red-500"
                                                : "bg-blue-100 border-gray-300 hover:bg-blue-50"
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
                                            <span className="text-green-500 text-xl ml-2">&#10004;</span>
                                        )}
                                        {isSelected && !isCorrectAnswer && (
                                            <span className="text-red-500 text-xl ml-2">&#10006;</span>
                                        )}
                                    </li>
                                </div>
                            );
                        })}
                    </div>
                    <div className="relative mb-6 flex items-center justify-between">
                        <div className="flex items-center justify-center w-10 h-10 border border-blue-400 rounded-full">
                            <span className="text-black">{checkedQuestions}</span>
                        </div>

                        <div className="flex-1 mx-4">
                            <div className="relative w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                    style={{ width: progress }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center w-10 h-10 border border-blue-400 rounded-full">
                            <span className="text-black">{dataQuestion?.length}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Direction
                            handleFirstQuestion={handleFirstQuestion}
                            handlePrevQuestion={handlePrevQuestion}
                            handleLastQuestion={handleLastQuestion}
                            handleNextQuestion={handleNextQuestion}
                            data={dataQuestion}
                            currentQuestion={currentQuestion}
                        />
                    </div>
                </div>

                <FilterQuestionsModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    dataChapter={dataChapter}
                    lesson={lesson}
                    setLesson={setLesson}
                    chapter={chapter}
                    setChapter={setChapter}
                    level={level}
                    setLevel={setLevel}
                    handleApplyFilter={handleApplyFilter}
                />
            </div>
        </div>
    );
};

export default Quiz;