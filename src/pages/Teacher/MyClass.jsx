import React from "react";
import { useSelector } from "react-redux";

export default function MyClass() {
  const { data } = useSelector((state) => state.class);
  console.log(data);
  return (
    <div className="grid grid-cols-1 justify-items-center">
      <h2>My Class</h2>
      <table className="table-auto border border-gray-400 w-full max-w-3xl">
        <thead>
          <tr>
            <th className="px-4 py-2">Class Name</th>
            <th className="px-4 py-2">Decription</th>
            <th className="px-4 py-2">Created By</th>
            <th className="px-4 py-2">Funtion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-2">ReactJS</td>
            <td className="border border-gray-400 px-4 py-2">
              Learining ReactJS
            </td>
            <td className="border border-gray-400 px-4 py-2">Phan Hung</td>
            <td className="border border-gray-400 px-4 py-2">
              <button className="btn btn-primary mr-4">Join</button>
              <button className="btn btn-success mr-4">View</button>
              <button className="btn btn-danger">Add</button>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">ReactJS</td>
            <td className="border border-gray-400 px-4 py-2">
              Learining ReactJS
            </td>
            <td className="border border-gray-400 px-4 py-2">Phan Hung</td>
            <td className="border border-gray-400 px-4 py-2">
              <button className="btn btn-primary mr-4">Join</button>
              <button className="btn btn-success mr-4">View</button>
              <button className="btn btn-danger">Add</button>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">ReactJS</td>
            <td className="border border-gray-400 px-4 py-2">
              Learining ReactJS
            </td>
            <td className="border border-gray-400 px-4 py-2">Phan Hung</td>
            <td className="border border-gray-400 px-4 py-2">
              <button className="btn btn-primary mr-4">Join</button>
              <button className="btn btn-success mr-4">View</button>
              <button className="btn btn-danger">Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
