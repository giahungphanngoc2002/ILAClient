import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const ManageHistory = ({ currentHistories, viewReview,indexOfFirstItem,totalPages, currentPage , handlePageChange,viewReviewAssigment }) => {
  return (
    <div>
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              No
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Student Name
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Score
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Time
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Class Name
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Type
            </th>
            <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentHistories.map((history, index) => (
            <tr key={history._id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {indexOfFirstItem + index + 1}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {history.studentID.name}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {history.point}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {new Date(history.createdAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {history?.classID?.classID
                  ? history?.classID?.classID
                  : history.iDTest}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button
                  className={history.isAssignment ? `px-3 py-2 rounded-lg text-white bg-green-500` : `px-3 py-2 rounded-lg text-white bg-red-500`} 
                  disabled
                >
                  {history.isAssignment ? "Assignment" : "Learning"}
                </button>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button
                  onClick={() =>
                    history.isAssignment
                      ? viewReviewAssigment(history._id)
                      : viewReview(history._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  <FontAwesomeIcon icon="book" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageHistory;
