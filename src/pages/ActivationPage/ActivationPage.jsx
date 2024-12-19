import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const response = await UserService.activateUser(activation_token);
          if (response.status === "OK") {
            setMessage("Email của bạn đã được kích hoạt thành công!");
            setTimeout(() => {
              window.location.href = "http://localhost:3000/manage/profile";
            }, 2000); // Chuyển hướng sau 2 giây
          } else {
            setError(true);
            setMessage(response.message);
          }
        } catch (err) {
          setError(true);
          setMessage("Token đã hết hạn! Vui lòng yêu cầu gửi lại email kích hoạt.");
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        {error ? (
          <AiOutlineWarning className="mx-auto mb-4 text-red-500 text-4xl" />
        ) : (
          <AiOutlineCheckCircle className="mx-auto mb-4 text-green-500 text-4xl" />
        )}
        <p className="text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default ActivationPage;