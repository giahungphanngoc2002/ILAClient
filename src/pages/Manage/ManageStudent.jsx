import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ManageStudent = ({ uniqueStudents , handleOpenUpdateModal , deleteStudentByID }) => {
    return (
        <div>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
                Avatar
              </th>
              <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
                Name
              </th>
              <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
                Email
              </th>
              <th className="px-5 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 text-left text-sm uppercase font-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {uniqueStudents.map((student) => (
              <tr key={student._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <img
                    src={student.avatar}
                    alt="User"
                    className="w-20 h-20 mr-2 pt-2.5 rounded-full object-cover"
                  />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {student.name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {student.email}
                </td>
                
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex space-x-2">
                    {/* <button
                      className="bg-blue-500 text-white p-3 rounded hover:bg-blue-700 w-10 h-10 flex items-center justify-center"
                      onClick={() => handleOpenUpdateModal(student._id)}
                    >
                      <FontAwesomeIcon icon="pen" />
                    </button> */}
                    <button
                      className="bg-red-500 text-white p-3 rounded hover:bg-red-700 w-10 h-10 flex items-center justify-center"
                      onClick={() => deleteStudentByID(student._id)}
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
  
  export default ManageStudent;
  