import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as UserService from "../../services/UserService"; // Đường dẫn đến file chứa hàm Axios
import { AiOutlineWarning, AiOutlineCheckCircle } from 'react-icons/ai';

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const response = await UserService.activateUser(activation_token);
          console.log(response);
          // You might want to set a success state or redirect here
        } catch (err) {
          setError(true);
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
        <p className="text-lg font-semibold">
          {error ? "Your token is expired!" : "Your email has been created successfully"}
        </p>
      </div>
    </div>
  );
};

export default ActivationPage;