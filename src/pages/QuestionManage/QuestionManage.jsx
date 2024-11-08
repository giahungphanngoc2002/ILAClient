import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import UpdateQuestionModal from '../Modal/UpdateQuestionModal';
import * as SubjectService from "../../services/SubjectService";
import { useNavigate, useParams } from 'react-router-dom';

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

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await SubjectService.getQuestions(idClass, idSubject);
                const questions = response.questions || []; // Lấy dữ liệu câu hỏi từ API
                setQuestionsData(questions);
                setFilteredQuestions(questions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [idClass, idSubject]);

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
        navigate(`/questionAI/${idClass}/${idSubject}`);
    };



    const handleOpenUpdateModal = (id) => {
        const question = questionsData.find((question) => question._id === id);
        setQuestion(question);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setQuestion(null);
        setShowUpdateModal(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
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
                        <option value="Geography">Geography</option>
                        <option value="History">History</option>
                        {/* Thêm các chương khác nếu có */}
                    </select>
                </div>

                <div className="flex-1">
                    <label className="block text-lg font-medium mb-1">Filter by Lesson:</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedLesson}
                        onChange={(e) => setSelectedLesson(e.target.value)}
                    >
                        <option value="All">All Lessons</option>
                        <option value="1">Lesson 1</option>
                        <option value="2">Lesson 2</option>
                        {/* Thêm các bài học khác nếu có */}
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
                                    Chapter: {question.chapter} - Lesson: {question.lesson || question.lession}
                                </p>

                                <div className="absolute top-4 right-4 space-x-2">
                                    <button
                                        className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600"
                                        onClick={() => handleOpenUpdateModal(question._id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                                        onClick={() => {}}
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
                />
            )}
        </div>
    );
};

export default QuestionManager;
