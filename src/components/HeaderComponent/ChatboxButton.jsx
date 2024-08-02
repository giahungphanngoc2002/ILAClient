import React, { useEffect, useState } from "react";
import { FaFacebookMessenger } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { toast } from "react-toastify";
import { createConversation } from "../../services/ConversationService";
import * as ClassService from "../../services/ClassService";
import { useQuery } from "@tanstack/react-query";

const ChatboxButton = ({ data }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [teacherID, setTeacherID] = useState([]);

  const { isAuthenticated, id: userId, isTeacher } = user || {};

  const getAllClass = async () => {
    const res = await ClassService.getAllClass();
    return res;
  };

  const {
    data: allclass,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allclass"],
    queryFn: getAllClass,
  });

  useEffect(() => {
    if (allclass && allclass.data.teacherID) {
      setTeacherID(allclass?.data.teacherID);
    }
  }, [allclass]);
  console.log("teachderID",teacherID)
  console.log("teachderID123",allclass?.data)

  const handleClick = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please login to create a conversation");
        return;
      }

      if (isTeacher) {
        navigate("/all-messages");
      } else {
        if (!data || !data._id || !data.userId || !data.userId._id || !userId) {
          toast.error("Invalid data or user information");
          return;
        }

        const groupTitle = `${data._id}-${userId}`;
        const teacherId = data.userId._id;
        const studentId = userId;

        const res = await createConversation({
          groupTitle,
          userId: studentId,
          teacherId: teacherId,
        });

        if (res.status === "OK") {
          navigate(`/conversation/${res.data._id}`);
        } else {
          toast.error(res.message || "Failed to create conversation");
        }
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating conversation"
      );
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading classes.</div>;
  }

  return (
    <div className="fixed bottom-5 right-5 transition-transform duration-300 hover:translate-y-[-10px] hover:scale-110">
      <Button
        onClick={handleClick}
        className="flex items-center bottom-6 justify-center w-12 h-12 rounded-full bg-blue-600 text-white"
      >
        <FaFacebookMessenger size={36} />
      </Button>
    </div>
  );
};

export default ChatboxButton;
