import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const FilterQuestionsModal = ({
    show,
    handleClose,
    dataChapter,
    lesson,
    setLesson,
    chapter,
    setChapter,
    level,
    setLevel,
    handleApplyFilter
}) => {
    return (
        <Modal show={show} onHide={handleClose} className="rounded-lg shadow-xl">
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
                            {dataChapter?.map((chapterItem) => (
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
                            {dataChapter?.filter(chapterItem => chapterItem.nameChapter === chapter).map((chapterItem) =>
                                chapterItem.lession.map((lessonName, index) => (
                                    <option key={index} value={lessonName}>
                                        {lessonName}
                                    </option>
                                ))
                            )}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="difficulty" className="mb-4">
                        <Form.Label className="block text-gray-700 font-medium">Độ Khó</Form.Label>
                        <Form.Control
                            as="select"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="mt-2 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            <option value="1">Dễ</option>
                            <option value="2">Trung Bình</option>
                            <option value="3">Khó</option>
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
                    onClick={handleApplyFilter}
                    className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                >
                    Áp Dụng Lọc
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FilterQuestionsModal;