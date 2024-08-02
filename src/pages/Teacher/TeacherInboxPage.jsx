import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import * as ConversationService from "../../services/ConversationService";
import { useQuery } from "@tanstack/react-query";
const TeacherInboxPage = () => {
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(user?.id);
  }, [user?.id]);
  console.log("123",userName)

//   useEffect(() => {
//     const messageList = axios.get(
//       `http://localhost:3001/api/conversation/getAllConversationsForTeacher/${user.id}`
//     );
//     console.log(messageList, "fff");
//   }, [user]);
    const { data: detailClass, isLoading, isError } = useQuery({
    queryKey: ['detailClass', userName],
    queryFn: () => ConversationService.getAllConversationsForTeacher(userName),
    enabled: !!userName, // Only run the query if userName is not empty
  });

  
  console.log('123123', detailClass);   

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      <h1 className="text-center text-[30px] py-3 font-Poppins">
        All Messages
      </h1>

      {/* All messages list */}
      <MessageList />
    </div>
  );
};

const MessageList = () => {
  return (
    <div className="w-full flex p-3 px-3 bg-[#00000010] cursor-pointer">
      <div className="relative">
        <img
          src="https://gcs.tripi.vn/public-tripi/tripi-feed/img/474115ZUY/anh-nen-hoat-hinh-cho-dien-thoai_061912426.jpg"
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-1" />
      </div>

      <div className="pl-3">
        <h1 className="text-[18px]">Trần Chí Phúc</h1>
        <p className="text-[16px] text-[#000c]">Yeah I am good</p>
      </div>
    </div>
  );
};

export default TeacherInboxPage;