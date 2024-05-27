import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import "bootstrap/dist/css/bootstrap.min.css";

import { isJsonString } from "./utils";
import { jwtDecode as jwt_decode } from 'jwt-decode';
import {useDispatch} from 'react-redux';
import * as UserService from './services/UserService';
import { updateUser } from "./redux/slices/userSlide";

export default function App() {
  const dispatch=useDispatch();
  // useEffect(() =>{
  //   const{storageData,decoded}  = handleDecoded()        
  //   if( decoded?.id ) {
  //     handleGetDetailsUSer(decoded?.id,storageData)
  //   }
  // },[])

  const handleDecoded =() => {
    let storageData = localStorage.getItem('access_token')
    let decoded ={}

    if(storageData && isJsonString(storageData)){
      storageData =JSON.parse(storageData)     
      decoded =jwt_decode(storageData)       
    }
    return {decoded,storageData}
  }

  UserService.axiosJWT.interceptors.request.use(async(config) =>{
    const currentTime =new Date()
    const{decoded}  = handleDecoded() 
    if(decoded?.exp < currentTime.getTime() / 1000){
      try {
        const data =await UserService.refreshToken()
        config.headers['Authorization'] =  `Bearer ${data?.access_token}`
      } catch (error) {
        console.error('Error refreshing token:', error)
        // Handle the error, e.g., log it, show an error message to the user, etc.
      }
    }
    return config
  })

  // const handleGetDetailsUSer =async(id ,token)=>{
  //   try {
  //     const res = await UserService.getDetailUser(id,token)
  //     dispatch(updateUser({...res?.data , access_token:token}))
  //   } catch (error) {
  //     console.error('Error getting user details:', error)
  //     // Handle the error, e.g., log it, show an error message to the user, etc.
  //   }
  // }

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultComponent : React.Fragment;
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
      </Router>
    </div>
  );
}