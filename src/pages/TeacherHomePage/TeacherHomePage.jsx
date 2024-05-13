import axios from 'axios';
import React, { useState } from 'react';

export default function TeacherHomePage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  async function generateAnswer() {
    setAnswer('loading...');
    const response = await axios({
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAmhcR2Olj1sd4BzsgEfy28_d67sKTz-kI',
      method: 'POST',
      data: {
        contents: [{ parts: [{ text: question + "cho tôi xin các câu hỏi trắc nghiệm liên quan đến bài thơ này" }] }],
      },
    });

    setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text']);
  }

  return (
    <div className="home-page-teacher p-6 text-center text-4xl">
      <h1 className="text-2xl font-bold mb-4">Chat AI</h1>
      <textarea
        className="question-input w-full h-40 p-2 mb-4 border rounded w-full"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      ></textarea>
      <button className="generate-button bg-green-500 text-white font-bold py-2 px-4 rounded mb-4" onClick={generateAnswer}>
        Generate answer
      </button>
      <pre className="answer text-xl font-bold">{answer}</pre>
      <button>Add vào lớp học</button>
    </div>
  );
}