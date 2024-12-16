import React, { useState, useEffect, createContext } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import UpdateQuestionModal from '../Modal/UpdateQuestionModal';
import * as SubjectService from "../../services/SubjectService";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { Modal, Button, Form } from 'react-bootstrap';


const QuestionManager = () => {
    const [selectedChapter, setSelectedChapter] = useState('All');
    const [selectedLesson, setSelectedLesson] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [questionsData, setQuestionsData] = useState([]);
    const { idClass, idSubject } = useParams();
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [toggleEditQuestion, setToggleEditQuestion] = useState(false);
    const [toggleEditLevel, setToggleEditLevel] = useState(false);
    const [toggleEditChapter, setToggleEditChapter] = useState(false);
    const [toggleEditLession, setToggleEditLession] = useState(false);
    const [toggleEditCA, setToggleEditCA] = useState(false);
    const [textQuestion, setTextQuestion] = useState("");
    const [textAnswer, setTextAnswer] = useState("");
    const [editingAnswerIndex, setEditingAnswerIndex] = useState(null);
    const [textCA, setTextCA] = useState("");
    const [textLevel, setTextLevel] = useState("");
    const [textChapter, setTextChapTer] = useState("");
    const [textLession, setTextLession] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [detailSubject, setDetailSubject] = useState("");
    const [showModalChooseChapter, setShowModalChooseChapter] = useState(false);
    const [chapter, setChapter] = useState();
    const [lesson, setLesson] = useState();
    const [nameSubject , setNameSubject] = useState();
    const [block , setBlock] = useState()

    const fetchQuestions = async () => {
        setIsLoading(true);
        try {
            const response = await SubjectService.getQuestions(idClass, idSubject);
            const questions = response.questions || [];
            setQuestionsData(questions);
            setFilteredQuestions(questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
        setIsLoading(false);
    };

    // Gọi fetchQuestions khi component được mount lần đầu
    useEffect(() => {
        fetchQuestions();
    }, [idClass, idSubject]);

    console.log(filteredQuestions)

    useEffect(() => {
        const fetchDetailSubject = async () => {
            setIsLoading(true);
            try {
                const detailSubjectData = await SubjectService.getDetailSubject(idSubject);
                setBlock(detailSubjectData?.block)
                setNameSubject(detailSubjectData?.nameSubject)
                setDetailSubject(detailSubjectData?.chapters);
            } catch (error) {
                console.error("Error fetching time tables:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetailSubject();
    }, [idSubject]);
    console.log("chapters ", detailSubject);

    const updateMutation = useMutation({
        mutationFn: async ({ classId, subjectId, questionId, updatedQuestion }) => {
            return SubjectService.updateQuestionById(classId, subjectId, questionId, updatedQuestion);
        },
        onMutate: () => setIsLoading(true), // Set loading state on mutation start
        onSuccess: (data) => {
            setIsLoading(false);
            toast.success("Question updated successfully");
            fetchQuestions(); // Tải lại danh sách câu hỏi sau khi cập nhật thành công
            // Reset loading state on success
            setShowUpdateModal(false);

        },
        onError: (error) => {
            toast.error("Error updating question.");
            setIsLoading(false); // Reset loading state on error

        },
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ classId, subjectId, questionId }) => {
            return SubjectService.deleteQuestionById(classId, subjectId, questionId); // Assuming deleteQuestionById exists in SubjectService
        },
        onMutate: () => setIsLoading(true), // Set loading state on mutation start
        onSuccess: () => {
            toast.success("Question deleted successfully");
            setIsLoading(false); // Reset loading state on success
            fetchQuestions(); // T

        },
        onError: (error) => {
            toast.error("Error deleting question.");
            setIsLoading(false); // Reset loading state on error

        },
    });


    useEffect(() => {
        let filtered = questionsData;

        if (selectedChapter !== 'All') {
            filtered = filtered.filter((q) => q.chapter === selectedChapter);
        }

        if (selectedLesson !== 'All') {
            filtered = filtered.filter((q) => q.lesson === selectedLesson || q.lession === selectedLesson);
        }

        if (searchTerm !== '') {
            filtered = filtered.filter((q) =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredQuestions(filtered);
    }, [selectedChapter, selectedLesson, searchTerm, questionsData]);



    const resetFilters = () => {
        window.history.back();
    };

    const goToCreateQuestionByAI = () => {
        setShowModalChooseChapter(!showModalChooseChapter)
    };

    const handleClose = () => {
        setShowModalChooseChapter(false)
    }


    const handleOpenUpdateModal = (id) => {
        const question = questionsData.find((question) => question._id === id);
        setQuestion(question);
        setShowUpdateModal(true);
    };


    const handleCloseUpdateModal = () => {
        setQuestion(null);
        setShowUpdateModal(false);
    };
    const handleQuestionChange = (e) => {
        setTextQuestion(e.target.value);
    };

    const saveQuestion = () => {
        setQuestion((prev) => ({
            ...prev,
            question: textQuestion,
        }));
        setToggleEditQuestion(!toggleEditQuestion);
    };

    const saveLevel = () => {
        setQuestion((prev) => ({
            ...prev,
            level: textLevel,
        }));
        setToggleEditLevel(!toggleEditLevel);
    };
    const saveLession = () => {
        setQuestion((prev) => ({
            ...prev,
            lession: textLession,
        }));
        setToggleEditLession(!toggleEditLession);
    };

    const saveChapter = () => {
        setQuestion((prev) => ({
            ...prev,
            chapter: textChapter,
        }));
        setToggleEditChapter(!toggleEditChapter);
    };

    const handleEditQuestionn = (question) => {
        setTextQuestion(question);
        setToggleEditQuestion(!toggleEditQuestion);
    };

    const handleCorrectAnswerChange = (e) => {
        setTextCA(e.target.value);
    };

    const handleEditLevel = (lv) => {
        setTextLevel(lv)
        setToggleEditLevel(!toggleEditLevel);
    };
    const handleEditLession = (lession) => {
        setTextLession(lession)
        setToggleEditLession(!toggleEditLession);
    };
    const handleEditChapter = (chapter) => {
        setTextChapTer(chapter)
        setToggleEditChapter(!toggleEditChapter);
    };

    const handleUpdateQuestion = () => {
        const updatedQuestion = {
            question: question.question,
            correctAnswer: question.correctAnswer,
            options: question.options,
            level: question.level,
            lession: question.lession,
            chapter: question.chapter
        };

        updateMutation.mutate({
            classId: idClass,
            subjectId: idSubject,
            questionId: question._id,
            updatedQuestion,
        });
    };

    const handleEditAnswer = (index, answer) => {
        setEditingAnswerIndex(index);
        setTextAnswer(answer);
    };

    const saveAnswer = () => {
        const updatedAnswers = [...question.options];
        updatedAnswers[editingAnswerIndex] = textAnswer;
        setQuestion((prev) => ({
            ...prev,
            options: updatedAnswers,
        }));
        setEditingAnswerIndex(null);
        setTextAnswer("");
    };

    const handleAnswerChange = (e) => {
        setTextAnswer(e.target.value);
    };

    const handleEditCA = (CA) => {
        setTextCA(CA)
        setToggleEditCA(!toggleEditCA);
    };

    const saveCorrectQuestion = () => {
        setQuestion((prev) => ({
            ...prev,
            correctAnswer: textCA,
        }));
        setToggleEditCA(!toggleEditCA);
    };

    const handleLevelChange = (e) => {
        setTextLevel(e.target.value);
    };
    const handleChapterChange = (e) => {
        setTextChapTer(e.target.value); // Cập nhật chương
        setTextLession(""); // Reset bài học khi chọn chương mới
    };

    const handleLessionChange = (e) => {
        setTextLession(e.target.value); // Cập nhật bài học
    }



    const handleDeleteQuestion = (id) => {
        deleteMutation.mutate({
            classId: idClass,
            subjectId: idSubject,
            questionId: id,
        });
    };
    const uniqueChapters = [...new Set(filteredQuestions.map((q) => q.chapter))];
    const uniqueLessions = [...new Set(filteredQuestions.map((q) => q.lession))];

    const handleGoToAI = () => {
        navigate(`/questionAI/${idClass}/${idSubject}?lesson=${lesson}&chapter=${chapter}&nameSubject=${nameSubject}&block=${block}`);
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {isLoading && <p>Loading...</p>}
            <h1 className="text-2xl font-bold mb-6 text-center">Quản lý câu hỏi</h1>

            {/* Bộ lọc theo Chương, Bài và Tìm kiếm */}
            <div className="mb-4 flex flex-wrap items-center space-x-4">
                <div className="flex-1">
                    <label className="block text-lg font-medium mb-1">Filter by Chapter:</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedChapter}
                        onChange={(e) => setSelectedChapter(e.target.value)}
                    >
                        <option value="All">All Chapters</option>
                        {uniqueChapters.map((chapter) => (
                            <option key={chapter} value={chapter}>
                                {chapter}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <label className="block text-lg font-medium mb-1">Filter by Lesson:</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedLesson}
                        onChange={(e) => setSelectedLesson(e.target.value)}
                    >
                        <option value="All">All Lessions</option>
                        {uniqueLessions.map((lession) => (
                            <option key={lession} value={lession}>
                                Lesson {lession}
                            </option>
                        ))}

                    </select>
                </div>

                <div className="flex-2">
                    <label className="block text-lg font-medium mb-1">Search by Question:</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-8 flex items-center justify-center"
                        onClick={goToCreateQuestionByAI}
                    >
                        <FaPlus className="mr-2" /> Tạo thêm câu hỏi
                    </button>
                </div>

                <div className="flex">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-8 flex items-center justify-center"
                        onClick={resetFilters}
                    >
                        <FaArrowLeft className="mr-2" /> Trở về
                    </button>
                </div>
            </div>

            {/* Hiển thị kết quả tìm kiếm */}
            <p className="text-right text-gray-600 mb-4">
                {filteredQuestions.length} câu hỏi được tìm thấy.
            </p>

            {/* Danh sách câu hỏi */}
            <div>
                {filteredQuestions.length === 0 ? (
                    <p className="text-lg">No questions found.</p>
                ) : (
                    <ul className="p-0">
                        {filteredQuestions.map((question) => (
                            <li key={question._id} className="mb-4 p-4 bg-white rounded shadow-md relative">
                                <h3 className="text-xl font-semibold">{question.question}</h3>
                                <ul className="mt-2 space-y-1">
                                    {question.options.map((option, index) => (
                                        <li key={index} className="ml-4 list-disc">
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-2 text-green-600 font-bold">
                                    Correct Answer: {question.correctAnswer}
                                </p>
                                <p className="mt-1 text-gray-500">
                                    Chapter: {question.chapter} - Lession: {question.lession}
                                </p>

                                {/* Nút cập nhật và xóa */}
                                <div className="absolute top-4 right-4 space-x-2">
                                    <button
                                        className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600"
                                        onClick={() => handleOpenUpdateModal(question._id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                                        onClick={() => handleDeleteQuestion(question._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {showUpdateModal && (
                <UpdateQuestionModal
                    showUpdateModal={showUpdateModal}
                    handleCloseUpdateModal={handleCloseUpdateModal}
                    question={question}
                    detailSubject={detailSubject}
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
                    handleLevelChange={handleLevelChange}
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
                    textLession={textLession}
                    handleLessionChange={handleLessionChange}
                    toggleEditLession={toggleEditLession}
                    handleEditLession={handleEditLession}
                    saveLession={saveLession}
                    textChapter={textChapter}
                    handleChapterChange={handleChapterChange}
                    toggleEditChapter={toggleEditChapter}
                    handleEditChapter={handleEditChapter}
                    saveChapter={saveChapter}
                />
            )}
            {showModalChooseChapter && (
                <Modal show={showModalChooseChapter} onHide={handleClose} className="rounded-lg shadow-xl">
                    <Modal.Header closeButton className="">
                        <Modal.Title>Lọc Câu Hỏi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-gray-50 p-6">
                        <Form>
                            <Form.Group controlId="chapter" className="mb-4">
                                <Form.Label className="block text-gray-700 font-medium">Chương</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={chapter}
                                    onChange={(e) => setChapter(e.target.value)}
                                    className="mt-2 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả</option>
                                    {detailSubject?.map((chapterItem) => (
                                        <option key={chapterItem._id} value={chapterItem.nameChapter}>
                                            {chapterItem.nameChapter}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="lesson" className="mb-4">
                                <Form.Label className="block text-gray-700 font-medium">Bài</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={lesson}
                                    onChange={(e) => setLesson(e.target.value)}
                                    className="mt-2 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả</option>
                                    {detailSubject?.filter(chapterItem => chapterItem.nameChapter === chapter).map((chapterItem) =>
                                        chapterItem.lession.map((lessonName, index) => (
                                            <option key={index} value={lessonName}>
                                                {lessonName}
                                            </option>
                                        ))
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="bg-gray-100">
                        <Button variant="secondary" onClick={handleClose} className="px-6 py-2 text-gray-600 hover:bg-gray-200">
                            Đóng
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleGoToAI}
                            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                        >
                            Áp Dụng Lọc
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );


};

export default QuestionManager;