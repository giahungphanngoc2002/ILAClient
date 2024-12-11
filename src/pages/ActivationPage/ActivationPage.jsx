// ActivationPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as UserService from "../../services/UserService"; // Đường dẫn đến file chứa hàm Axios
import { AiOutlineWarning, AiOutlineCheckCircle } from 'react-icons/ai';
import { useDispatch } from "react-redux"; // Thêm useDispatch
import { updateUser } from "../../redux/slices/userSlide"; // Thêm updateUser action

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch(); // Khai báo useDispatch

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const response = await UserService.activateUser(activation_token);
          if (response.status === "OK") {
            setMessage("Your email has been activated successfully!");
            // Dispatch action để cập nhật lại email
            dispatch(updateUser({ email: response.data.email })); // Giả sử response có data.email
          } else {
            setError(true);
            setMessage(response.message);
          }
        } catch (err) {
          setError(true);
          setMessage("Your token is expired! Please request a new activation email.");
        }
      };
      sendRequest();
    }
  }, [activation_token, dispatch]); // Dispatch khi activation_token thay đổi

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
