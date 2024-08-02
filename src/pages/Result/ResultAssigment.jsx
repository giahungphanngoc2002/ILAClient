import React, { useEffect, useState } from "react";
import * as HistoryTestService from "../../services/historyTestService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function ResultAssigment() {
  const { id } = useParams();
  console.log("id",id)
  const [historiesAssigment, setHistoriesAssigment] = useState([]);

  const getDetailHistoryTest = async (id) => {
    const res = await HistoryTestService.getDetailHistoryTest(id);
    return res;
  };

  const { data: detailTest, isLoading, isError } = useQuery({
    queryKey: ["detailTest", id],
    queryFn: () => getDetailHistoryTest(id),
  });

  useEffect(() => {
    if (detailTest) {
        setHistoriesAssigment(detailTest);
    }
  }, [detailTest]);

  console.log("123123",detailTest);

  if (isLoading) {
    return <div className="text-center text-xl font-bold">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-xl font-bold text-red-500">Error loading data</div>;
  }

  return (
    <div className="p-4">
      <h1 className="bg-black text-white text-center py-6 rounded-lg text-2xl">Assigment Review</h1>
      {historiesAssigment?.data?.historyAssignment.map((historyTest, historyTestIndex) => (
        <div key={historyTestIndex} className="mt-6">
          <ul
            className={`p-4 rounded-lg ${historyTest.result ? "bg-green-100 border-3 border-green-200" : "bg-red-100 border-3 border-red-200"}`}
          >
            <p className="text-lg font-semibold mb-2">{historyTest.question}</p>
            {historyTest.answers.map((answer, answerIndex) => (
              <li key={answerIndex} className="mb-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={answer}
                    checked={answer === historyTest.userAnswer}
                    readOnly
                    className="mr-2"
                  />
                  {answer}
                </label>
              </li>
            ))}
            <p className="bg-gray-200 p-2 rounded-lg border-2 border-gray-300 mt-2">
              Right answer is: <span className="font-bold">{historyTest.correctAnswer}</span>
            </p>
          </ul>
        </div>
      ))}
    </div>
  );
}
