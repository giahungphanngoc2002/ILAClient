import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as UserService from "../../services/UserService"; // Đường dẫn đến file chứa hàm Axios

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const response = await UserService.activateUser(activation_token);
          console.log(response);
        } catch (err) {
          setError(true);
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your token is expired!</p>
      ) : (
        <p>Your account has been created successfully</p>
      )}
    </div>
  );
};

export default ActivationPage;