import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as ClassService from "../../services/ClassService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPencilAlt } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import ModalSettingClass from "../Modal/ModalSettingClass";

export default function MyClass() {
  const { data } = useSelector((state) => state.class);
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [classID, setClassID] = useState("");
  const [nameClass, setNameClass] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");
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

  const updateClassMutation = useMutation({
    mutationFn: ({ selectedClassId ,data}) => ClassService.updateClass(selectedClassId,data),
    onSuccess: () => {
      queryClient.invalidateQueries(["detailClassByID",selectedClassId]);
    },
  });

  useEffect(() => {
    if (updateClassMutation.isSuccess) {
      toast.success("Class update successfully");
    }
  }, [updateClassMutation.isSuccess]);

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

  const {
    data: detailClassByID,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery({
    queryKey: ["detailClassByID", selectedClassId],
    queryFn: () => ClassService.getDetailClass(selectedClassId),
    enabled: !!selectedClassId,
  });

  useEffect(() => {
    if (detailClassByID?.data) {
      setClassID(detailClassByID.data.classID);
      setNameClass(detailClassByID.data.nameClass);
      setDescription(detailClassByID.data.description);
      setSubject(detailClassByID.data.subject);
      setStatus(detailClassByID.data.status);
    }
  }, [detailClassByID?.data]);

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

  const handleSettingClass = (id) => {
    setSelectedClassId(id);
    setShowSettingModal(true);
  };

  console.log(classID, status)


  const handleCloseSettingModal = () => {
    setShowSettingModal(false);
    setSelectedClassId(null);
  };

  const handleOnchangeClassID = (e) => {
    setClassID(e.target.value);
  };

  const handleOnchangeClassName = (e) => {
    setNameClass(e.target.value);
  };

  const handleOnchangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleOnchangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleOnchangeStatus = (e) => {
    setStatus(e.target.checked);
  };

  const handleSaveClass = () => {
    const data = {
      classID :classID,
      nameClass:nameClass,
      description:description,
      subject:subject,
      status:status,
    }; 
    updateClassMutation.mutate(
      {  selectedClassId, data })
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
                <th className="py-4 px-6"></th>
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
                  <td className="py-4 px-6 text-center">
                    <button
                      className="flex items-center justify-center bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition duration-300 focus:outline-none"
                      onClick={() => handleSettingClass(item._id)}
                    >
                      <FaPencilAlt className="w-5 h-5" />
                    </button>
                  </td>
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
      {showSettingModal && (
        <ModalSettingClass
          showSettingModal={showSettingModal}
          handleCloseSettingModal={handleCloseSettingModal}
          isLoading={isDetailLoading}
          isError={isDetailError}
          handleOnchangeClassID={handleOnchangeClassID}
          handleOnchangeClassName={handleOnchangeClassName}
          handleOnchangeDescription={handleOnchangeDescription}
          handleOnchangeSubject={handleOnchangeSubject}
          handleOnchangeStatus={handleOnchangeStatus}
          classID={classID}
          nameClass={nameClass}
          subject={subject}
          description={description}
          status={status}
          handleSaveClass={handleSaveClass}
        />
      )}
    </div>
  );
}
