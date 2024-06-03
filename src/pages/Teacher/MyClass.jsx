import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as ClassService from "../../services/ClassService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function MyClass() {
  const { data } = useSelector((state) => state.class);
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(user?.name);
  }, [user?.name]);

  console.log("name", userName)

  const getAllClass = async () => {
    const res = await ClassService.getAllClass();
    return res;
  };

  const {
    data: allclass1,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allclass1"],
    queryFn: getAllClass,
  });

  console.log("allclass1", allclass1);

  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading classes.</div>;
  }
  const allclass =
    allclass1?.length &&
    allclass1?.map((item) => {
      return { ...item, key: item._id };
    });
  // Check if allclass1 is an array before mapping
  const filteredClass1 = allclass1.data?.filter((item) => {
    return item.teacherID?.name === userName;
  });
  
  const classList = Array.isArray(filteredClass1) ? filteredClass1 : [];

  console.log("filtered: " ,filteredClass1)

  const handleAddQuestion = (id) => {
    navigate(`/questionAI/${id}`);
  };

  const handleClassList = (id) => {
    navigate(`/quiz/${id}`);
  };
  return (
    <div className="grid grid-cols-1 justify-items-center">
      <h2>My Class</h2>
      <table className="table-auto border border-gray-400 w-full max-w-3xl">
        <thead>
          <tr>
            <th className="px-4 py-2">Class Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Created By</th>
            <th className="px-4 py-2">Function</th>
          </tr>
        </thead>
        <tbody>
        {classList.map((item, index) => (
          <tr key={index}>
            <td className="border border-gray-400 px-4 py-2">
              {item?.nameClass}
            </td>
            <td className="border border-gray-400 px-4 py-2">
              {item?.description}
            </td>
            <td className="border border-gray-400 px-4 py-2">
              {item?.teacherID?.name}
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <button className="btn btn-primary mr-4"
               onClick={() => handleClassList(item._id)}
              >Join</button>
              <button className="btn btn-success mr-4">View</button>
              <button
                className="btn btn-danger"
                onClick={() => handleAddQuestion(item._id)}
              >
                Add
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}
