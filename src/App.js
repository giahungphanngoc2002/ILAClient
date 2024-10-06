import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isJsonString } from "./utils";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { useDispatch } from "react-redux";
import * as UserService from "./services/UserService";
import { updateUser } from "./redux/slices/userSlide";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};

    if (storageData && isJsonString(storageData)) {
      try {
        storageData = JSON.parse(storageData);
        if (typeof storageData === 'string') {
          decoded = jwt_decode(storageData);  // Decode only if it's a string
        } else {
          console.error("Invalid token format. Expected a string.");
        }
      } catch (error) {
        console.error("Error decoding token:", error.message); // Catch any decoding errors
      }
    } else {
      console.error("Invalid or missing token in localStorage.");
    }
    return { decoded, storageData };
  };

  const handleGetDetailsUser = async (id, token) => {
    if (!token) {
      console.error("User is not logged in.");
      return;
    }

    if (!id) {
      console.error("User ID is not provided.");
      return;
    }

    try {
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("User not found. Please check the user ID and URL.");
      } else {
        console.error("Error getting user details:", error);
      }
    }
  };

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date();
    const { decoded } = handleDecoded();
    if (decoded?.exp && decoded.exp < currentTime.getTime() / 1000) {
      try {
        const data = await UserService.refreshToken();
        config.headers["Authorization"] = `Bearer ${data?.access_token}`;
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }
    return config;
  });

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader
              ? DefaultComponent
              : React.Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <ToastContainer />
      </Router>
    </div>
  );
}