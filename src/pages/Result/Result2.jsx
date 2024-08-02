import React, { useEffect, useState } from "react";
import * as HistoryService from "../../services/HistoryService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function Result2() {
  const { id } = useParams();
  const [histories, setHistories] = useState([]);

  const getDetailsClass = async (id) => {
    const res = await HistoryService.getDetailHistory(id);
    return res;
  };

  const {
    data: detailHistory,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["detailHistory", id],
    queryFn: () => getDetailsClass(id),
  });

  useEffect(() => {
    if (detailHistory) {
      setHistories(detailHistory);
    }
  }, [detailHistory]);

  console.log(histories);

  if (isLoading) {
    return <div className="text-center text-xl font-bold">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-xl font-bold text-red-500">Error loading data</div>;
  }

  return (
    <div className="p-4">
      <h1 className="bg-black text-white text-center py-6 rounded-lg text-2xl">Quiz Review</h1>
      {histories?.data?.historyAssignment.map((history, historyIndex) => (
        <div key={historyIndex} className="mt-6">
          <ul
            className={`p-4 rounded-lg ${history.result ? "bg-green-100 border-3 border-green-200" : "bg-red-100 border-3 border-red-200"}`}
          >
            <p className="text-lg font-semibold mb-2">{history.question}</p>
            {history.answers.map((answer, answerIndex) => (
              <li key={answerIndex} className="mb-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={answer}
                    checked={answer === history.userAnswer}
                    readOnly
                    className="mr-2"
                  />
                  {answer}
                </label>
              </li>
            ))}
            <p className="bg-gray-200 p-2 rounded-lg border-2 border-gray-300 mt-2">
              Right answer is: <span className="font-bold">{history.correctAnswer}</span>
            </p>
          </ul>
        </div>
      ))}
    </div>
  );
}
