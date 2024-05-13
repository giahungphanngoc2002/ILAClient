import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "axios";
// import { isJsonString } from "./utils";
// import { jwtDecode as jwt_decode } from 'jwt-decode';
// import {useDispatch} from 'react-redux';
// import * as UserService from './services/UserService';
// import { updateUser } from "./redux/slices/userSlide";
// import { config } from "dotenv";
export default function App() {
  // const dispatch=useDispatch();
  // useEffect(() =>{
  //   const{storageData,decoded}  = handleDecoded()        
  //       if( decoded?.id ) {
  //         handleGetDetailsUSer(decoded?.id,storageData)
  //       }
  // },[])

  // const handleDecoded =() => {
  //   let storageData = localStorage.getItem('access_token')
  //   let decoded ={}

  //   if(storageData && isJsonString(storageData)){
  //     storageData =JSON.parse(storageData)     
  //     decoded =jwt_decode(storageData)       
  //   }
  //   return {decoded,storageData}
  // }
  // UserService.axiosJWT.interceptors.request.use(async(config) =>{
  //   const currentTime =new Date()
  //   const{decoded}  = handleDecoded() 
  //   if(decoded?.exp < currentTime.getTime() / 1000){
  //     const data =await UserService.refreshToken()
  //     config.headers['token'] =  `Bearer${data?.access_token}`
  //   }
  // })
  // const handleGetDetailsUSer =async(id ,token)=>{
  //   const res = await UserService.getDetailUser(id,token)
  //   dispatch(updateUser({...res?.data , access_token:token}))
  // }
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
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
