import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Button, Divider, Image, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as UserService from '../../services/UserService'
import { useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from  '../../components/MessageComponent/Message'
// import Loading from '../../components/LoadingComponent/Loading';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import {useDispatch} from 'react-redux'
import { updateUser } from "../../redux/slices/userSlide";



export default function SignInPage() {
  const dispatch =useDispatch()
  const navigate =useNavigate()

  const mutation = useMutationHooks (
     data => UserService.loginUser(data)
  )

  const {data,  isSuccess ,isError} = mutation
  useEffect(()=>{
    if(isSuccess && data?.status !== 'ERR'){
      message.success()
      navigate( '/')          
      localStorage.setItem('access_token',data?.access_token)
      if(data?.access_token){
        const decoded =jwt_decode(data?.access_token)
        console.log('decoded',decoded)
        if(decoded?.id){
          handleGetDetailsUSer(decoded?.id,data?.access_token)
        }
      }
    }else if (isError){
      message.error()
    }
  },[isSuccess ,isError]
  )
 
   const handleGetDetailsUSer =async(id ,token)=>{
    const res = await UserService.getDetailUser(id,token)
    dispatch(updateUser({...res?.data , access_token:token}))
   }
  const[email,setEmail]= useState('')
  const[password,setPassword]= useState('')


  const handleOnchangeEmail =(value)=>{
      setEmail(value)
  }

  const handleOnchangePassword =(value)=>{
    setPassword(value)
}

  const handleNavigateSignup =() =>{
    navigate( '/signup')
  }
  const handleSignin =() =>{
     mutation.mutate({
    email,
    password
  })
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `rgba(0,0,0,0.53)`,
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p style={{ fontSize: "16px", paddingTop: "16px" }}>
            Đăng nhập và tạo tài khoản
          </p>
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com" value ={email} Onchange= {handleOnchangeEmail}
          />
         
         <InputForm type="password" placeholder="password" value ={password} Onchange= {handleOnchangePassword} />
         
          {data?.status === 'ERR' && <span style={{color:'red'}}>{data?.message}</span>}
          
          <ButtonComponent
          disabled ={!email.length || !password.length}
          onClick={handleSignin}  
            size={40}
            styleButton={{
              background: "rgb(255,57,69)",
              height: "48px",
              width: "220px",
              border: "none",
              borderRadius: "4px",
              margin: "26px 0 10px",
            }}
            textButton={"Đăng nhập"}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
          
         
          <p>
            <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
          </p>
          <p style={{ fontSize: "16px" }}>
            Chưa có tài khoản?{" "}
            <WrapperTextLight onClick={handleNavigateSignup}>Tạo tài khoản</WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src="/images/login.png"
            preview={false}
            alt="image-logo"
            height="100%"
            width="100%"
          />
        </WrapperContainerRight>
      </div>
    </div>
  );
}
