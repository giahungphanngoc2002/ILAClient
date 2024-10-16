import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

// Dữ liệu câu hỏi mẫu
const questionsData = [
    {
        id: 1,
        question: 'What is React?',
        options: ['A library for building UI', 'A backend framework', 'A database'],
        correctAnswer: 'A library for building UI',
        chapter: 'Chapter 1',
        lesson: 'Lesson 1',
    },
    {
        id: 2,
        question: 'What is a Hook?',
        options: ['A function in React', 'A type of data', 'A database query'],
        correctAnswer: 'A function in React',
        chapter: 'Chapter 1',
        lesson: 'Lesson 2',
    },
    {
        id: 3,
        question: 'What is JSX?',
        options: ['A JavaScript extension', 'A CSS framework', 'A programming language'],
        correctAnswer: 'A JavaScript extension',
        chapter: 'Chapter 2',
        lesson: 'Lesson 1',
    },
    // Thêm các câu hỏi khác ở đây
];

const QuestionManager = () => {
    const [selectedChapter, setSelectedChapter] = useState('All');
    const [selectedLesson, setSelectedLesson] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredQuestions, setFilteredQuestions] = useState(questionsData);

    // Lọc câu hỏi dựa trên chương, bài và tìm kiếm từ khóa
    useEffect(() => {
        let filtered = questionsData;

        if (selectedChapter !== 'All') {
            filtered = filtered.filter((q) => q.chapter === selectedChapter);
        }

        if (selectedLesson !== 'All') {
            filtered = filtered.filter((q) => q.lesson === selectedLesson);
        }

        if (searchTerm !== '') {
            filtered = filtered.filter((q) =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredQuestions(filtered);
    }, [selectedChapter, selectedLesson, searchTerm]);

    // Hàm đặt lại bộ lọc và tìm kiếm
    const resetFilters = () => {
        window.history.back()
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            
            <h1 className="text-2xl font-bold mb-6 text-center">Quản lý câu hỏi</h1>

            {/* Bộ lọc theo Chương, Bài và Tìm kiếm */}
            <div className="mb-4 flex flex-wrap items-center space-x-4">
                {/* Bộ lọc theo Chương */}
                <div className="flex-1">
                    <label className="block text-lg font-medium mb-1">Filter by Chapter:</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedChapter}
                        onChange={(e) => setSelectedChapter(e.target.value)}
                    >
                        <option value="All">All Chapters</option>
                        <option value="Chapter 1">Chapter 1</option>
                        <option value="Chapter 2">Chapter 2</option>
                        <option value="Chapter 3">Chapter 3</option>
                    </select>
                </div>

                {/* Bộ lọc theo Bài */}
                <div className="flex-1">
                    <label className="block text-lg font-medium mb-1">Filter by Lesson:</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedLesson}
                        onChange={(e) => setSelectedLesson(e.target.value)}
                    >
                        <option value="All">All Lessons</option>
                        <option value="Lesson 1">Lesson 1</option>
                        <option value="Lesson 2">Lesson 2</option>
                    </select>
                </div>

                {/* Tìm kiếm theo câu hỏi */}
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

                {/* Nút "Trở về" */}
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
                    <ul className='p-0'>
                        {filteredQuestions.map((question) => (
                            <li key={question.id} className="mb-4 p-4 bg-white rounded shadow-md">
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
                                    Chapter: {question.chapter} - Lesson: {question.lesson}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default QuestionManager;
