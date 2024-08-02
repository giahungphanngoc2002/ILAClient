import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ManageTest = ({
  selectedQuestions,
  handleSelectAll,
  handleSelect,
  questions,
  allclass1,
  deleteTestByID,
  handleOpenAllQuestion,
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
              ID Test
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Time
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Time Created
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {allclass1.data.tests.map((test) => (
            <tr key={test._id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(test._id)}
                  onChange={(e) => handleSelect(e, test._id)}
                />
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {test.iDTest}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {test.timeTest}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {new Date(test.createdAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white p-3 rounded hover:bg-blue-700 w-10 h-10 flex items-center justify-center"
                    onClick={() => handleOpenAllQuestion(test._id)}
                  >
                    <FontAwesomeIcon icon="book" />
                  </button>
                  <button
                    className="bg-red-500 text-white p-3 rounded hover:bg-red-700 w-10 h-10 flex items-center justify-center"
                    onClick={() => deleteTestByID(test._id)}
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

export default ManageTest;
