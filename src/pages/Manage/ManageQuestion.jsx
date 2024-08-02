import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ManageQuestion = ({
  questions,
  selectedQuestions,
  handleSelectAll,
  handleSelect,
  handleOpenUpdateModal,
  deleteQuestionByID,
  handleOpenAddQuestionToTestModal,
}) => {
  return (
    <div>
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedQuestions.length === questions.length}
              />
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Question
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Level
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Correct Answer
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question._id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(question._id)}
                  onChange={(e) => handleSelect(e, question._id)}
                />
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {question.question}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {question.level}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {question.correctAnswer}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white p-3 rounded hover:bg-blue-700 w-10 h-10 flex items-center justify-center"
                    onClick={() => handleOpenUpdateModal(question._id)}
                  >
                    <FontAwesomeIcon icon="pen" />
                  </button>
                  <button
                    className="bg-red-500 text-white p-3 rounded hover:bg-red-700 w-10 h-10 flex items-center justify-center"
                    onClick={() => deleteQuestionByID(question._id)}
                  >
                    <FontAwesomeIcon icon="trash" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuestion;
