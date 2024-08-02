import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as ClassService from "../../services/ClassService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { toast } from "react-toastify";

export default function MyClass() {
  const { data } = useSelector((state) => state.class);
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState("");
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  useEffect(() => {
    setUserName(user?.name);
  }, [user?.name]);

  const deleteMutation = useMutation({
    mutationFn: ({ classId }) => ClassService.deleteClassByID(classId),
    onSuccess: () => {
      queryClient.invalidateQueries(["allclass1"]);
    },
  });

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      toast.success("Class deleted successfully");
    }
  }, [deleteMutation.isSuccess]);

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
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading classes.
      </div>
    );
  }

  const allclass =
    allclass1?.length &&
    allclass1?.map((item) => {
      return { ...item, key: item._id };
    });

    const filteredClass1 = allclass1.data?.filter((item) => {
      return item.teacherID?.name === userName && 
             item.teacherID?.classes.some((classRole) => classRole.isTeacher === true);
    });

  const classList = Array.isArray(filteredClass1) ? filteredClass1 : [];

  console.log("filtered: ", filteredClass1);

  const handleAddQuestion = (id) => {
    navigate(`/questionAI/${id}`);
  };

  const handleClassList = (id) => {
    navigate(`/quiz/${id}`);
  };

  const handleViewClass = (id) => {
    navigate(`/viewClass/${id}`);
  };

  const handleDeleteClass = (id) => {
    deleteMutation.mutate({ classId: id });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          My Class
        </h2>
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-indigo-600 text-white uppercase text-sm leading-normal text-center">
                <th className="py-4 px-6">Class ID</th>
                <th className="py-4 px-6">Class Name</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-base font-weight text-center">
              {classList.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100 transition duration-300"
                >
                  <td className="py-4 px-6">{item?.classID}</td>
                  <td className="py-4 px-6">{item?.nameClass}</td>
                  <td className="py-4 px-6">{item?.description}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition duration-300"
                        onClick={() => handleClassList(item._id)}
                      >
                        Join
                      </button>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-600 transition duration-300"
                        onClick={() => handleViewClass(item._id)}
                      >
                        View
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-yellow-600 transition duration-300"
                        onClick={() => handleAddQuestion(item._id)}
                      >
                        Add
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition duration-300"
                        onClick={() => handleDeleteClass(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  
}
