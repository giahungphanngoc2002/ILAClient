

// App.js

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { useDispatch } from "react-redux";
import * as UserService from "./services/UserService";
import { updateUser } from "./redux/slices/userSlide";
import DefaultSidebar from "./components/DefaultSidebar/DefaultSidebar";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded.id, storageData);
    }
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};

    if (storageData) {
      try {
        decoded = jwt_decode(storageData);
      } catch (error) {
        console.error("Error decoding token:", error.message);
      }
    }
    return { decoded, storageData };
  };

  const handleGetDetailsUser = async (id, token) => {
    if (!token) return;
    try {
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Error getting user details:", error);
    }
  };

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date().getTime() / 1000;
    const { decoded } = handleDecoded();

    if (decoded?.exp && decoded.exp < currentTime) {
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
    <div className="flex h-screen">
      <Router>
        <div className="flex flex-col flex-1">
          <Routes>
            {routes.map(({ path, page: Page, isShowSideBar, isShowHeader }, index) => (
              <Route
                key={index}
                path={path}
                element={
                  <div className="flex bg-gray-100">
                    {isShowSideBar && <DefaultSidebar />}
                    <div className="flex-1">
                      {isShowHeader && <DefaultComponent />}
                      {path.includes("/teacher") ? (
                        <ProtectedRoute>
                          <Page />
                        </ProtectedRoute>
                      ) : (
                        <Page />
                      )}
                    </div>
                  </div>
                }
              />
            ))}
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
      </Router>
    </div>
  );
}
