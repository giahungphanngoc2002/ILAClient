import React ,{ useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from '../../services/UserService'
// import { data } from "autoprefixer";
import * as message from  '../../components/MessageComponent/Message'
// import Loading from "../../components/LoadingComponent/Loading";
export default function SignUp() {
  const[email,setEmail]= useState('')
  const[password,setPassword]= useState('')
  const[confirmPassword,setConfirmPassword]= useState('')
  const handleOnchangeEmail =(value)=>{
    setEmail(value)
}
const navigate =useNavigate()
const mutation = useMutationHooks (
  data => UserService.signupUser(data)
  
)

const handleNavigateSignin =() =>{
  navigate( '/signin')
}
const {data,  isSuccess , isError} = mutation
useEffect(()=>{
  if(isError){
    message.error()
    
  }else if (isSuccess && data?.status !== 'ERR'){
    
    message.success()
    console.log(data)
    handleNavigateSignin()
  }
},[isSuccess,isError]
)
const handleOnchangePassword =(value)=>{
  setPassword(value)
}
const handleOnchangeConfirmPassword =(value)=>{
  setConfirmPassword(value)
}

const handleSignup =() =>{
  mutation.mutate({
    email,
    password,
    confirmPassword
    
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
          <InputForm
            placeholder="Password"
            type="password" value ={password} Onchange= {handleOnchangePassword}
            style={{ marginBottom: "10px" }}
          />
          <InputForm placeholder="Confirm Password" type="password"value ={confirmPassword} Onchange= {handleOnchangeConfirmPassword} />
         
          {data?.status === 'ERR' && <span style={{color:'red'}}> {data?.message}</span>}
          
          <ButtonComponent
          disabled ={!email.length || !password.length ||!confirmPassword.length}
          onClick={handleSignup}
           
            size={40}
            styleButton={{
              background: "rgb(255,57,69)",
              height: "48px",
              width: "220px",
              border: "none",
              borderRadius: "4px",
              margin: "26px 0 10px",
            }}
            textButton={"Đăng Ký"}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
          
          <p style={{ fontSize: "16px" }}>
            Bạn đã có tài khoản?
            <WrapperTextLight onClick={handleNavigateSignin} >Đăng Nhập</WrapperTextLight>
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
