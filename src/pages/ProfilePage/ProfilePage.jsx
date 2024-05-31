import React, { useEffect, useState } from "react";
import {  WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useSelector } from "react-redux";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from  '../../components/MessageComponent/Message'
import {useDispatch} from 'react-redux'
import { updateUser } from "../../redux/slices/userSlide";
import { Button, Upload } from "antd";
import {UploadOutlined} from '@ant-design/icons'
// import { getBase64 } from "../../utils";


const ProfilePage =() =>{
    const user =useSelector((state)=> state.user)
    const[email ,setEmail]= useState(user?.email)
    const[name ,setName]= useState( user?.name)
    const[phone ,setPhone]= useState(user?.phone)
    const[address ,setAddress]= useState(user?.address)
    const[age ,setAge]= useState(user?.age)
    // const[avatar ,setAvatar]= useState(user?.avatar)
    const dispatch =useDispatch()
    const mutation = useMutationHooks (
        (data) => {
            const{id,access_token, ...rests}=data
            UserService.updateUser(id,rests,access_token)
        }
     )
     
     const {data,  isSuccess ,isError} = mutation
     useEffect(()=>{
        if(isSuccess && data?.status !== 'ERR'){
          message.success()
          handleGetDetailsUSer(user?.id, user?.access_token)      
        }else if (isError){
          message.error()
        }
      },[isSuccess ,isError]
      )
     
       const handleGetDetailsUSer =async(id ,token)=>{
        const res = await UserService.getDetailUser(id,token)
        dispatch(updateUser({...res?.data , access_token:token}))
       }
    useEffect(()=>{
        setEmail(user?.email) 
        setName( user?.name) 
        setPhone (user?.phone)
        setAddress (user?.address)
        setAge(user?.age)
        // setAvatar(user?.avatar)
    },[user])


    const handleOnchangeEmail =(value) =>{
        setEmail(value)
    }
    const handleOnchangeName =(value) =>{
        setName(value)
    }
    const handleOnchangePhone =(value) =>{
        setPhone(value)
    }
    const handleOnchangeAdress =(value) =>{
        setAddress(value)
    }
    const handleOnchangeAge =(value) =>{
        setAge(value)
    }
    // const handleOnchangeAvatar = async(fileList) =>{
    //    const file =fileList[0]
    //    if(!file.url && !file.preview){
    //     file.preview =await getBase64(file.originFileObj);
    //    }
    //    setAvatar(file.url)
    // }

    const handleUpdate =() =>{
        mutation.mutate({id: user?.id,email,name,phone,address,age ,access_token:user?.access_token})

    }
    return(
        <div style={{width:'1270px' ,margin:'0 auto', height:'500px'}}>
          <WrapperHeader>Thông Tin Người Dùng</WrapperHeader>  
          <WrapperContentProfile>          
                <WrapperInput>
             <WrapperLabel>Name</WrapperLabel>  
             <InputForm
            style={{ width:'300px' }} id="name"
             value ={name} Onchange= {handleOnchangeName}
          /> 
          <ButtonComponent
          
          onClick={handleUpdate}  
            size={40}
            styleButton={{
              
              height: "30px",
              width: "fit-content",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "2px 6px 6px",
            }}
            textButton={"cập nhập"}
            styleTextButton={{
              color: "rgb(26, 148, 255",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
          </WrapperInput>
          <WrapperInput>
             <WrapperLabel>Email</WrapperLabel>  
             <InputForm
            style={{ width:'300px' }} id="email"
             value ={email} Onchange= {handleOnchangeEmail}
          /> 
          <ButtonComponent
          
          onClick={handleUpdate}  
            size={40}
            styleButton={{
              
              height: "30px",
              width: "fit-content",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "2px 6px 6px",
            }}
            textButton={"cập nhập"}
            styleTextButton={{
              color: "rgb(26, 148, 255",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
          </WrapperInput>
          <WrapperInput>
             <WrapperLabel>Phone</WrapperLabel>  
             <InputForm
            style={{ width:'300px' }} id="phone"
             value ={phone} Onchange= {handleOnchangePhone}
          /> 
          <ButtonComponent
          
          onClick={handleUpdate}  
            size={40}
            styleButton={{
              
              height: "30px",
              width: "fit-content",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "2px 6px 6px",
            }}
            textButton={"cập nhập"}
            styleTextButton={{
              color: "rgb(26, 148, 255",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
          </WrapperInput>
          <WrapperInput>
             <WrapperLabel>Address</WrapperLabel>  
             <InputForm
            style={{ width:'300px' }} id="address"
             value ={address} Onchange= {handleOnchangeAdress}
          /> 
          <ButtonComponent
          
          onClick={handleUpdate}  
            size={40}
            styleButton={{
              
              height: "30px",
              width: "fit-content",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "2px 6px 6px",
            }}
            textButton={"cập nhập"}
            styleTextButton={{
              color: "rgb(26, 148, 255",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
          </WrapperInput>
          <WrapperInput>
             <WrapperLabel>Age</WrapperLabel>  
             <InputForm
            style={{ width:'300px' }} id="age"
             value ={age} Onchange= {handleOnchangeAge}
          /> 
          <ButtonComponent
          
          onClick={handleUpdate}  
            size={40}
            styleButton={{
              
              height: "30px",
              width: "fit-content",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "2px 6px 6px",
            }}
            textButton={"cập nhập"}
            styleTextButton={{
              color: "rgb(26, 148, 255",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
          </WrapperInput>
          {/* <WrapperInput>
             <WrapperLabel>Avatar</WrapperLabel>  
             <WrapperUploadFile Onchange={handleOnchangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined/>}>Select File</Button>
             </WrapperUploadFile>
             {avatar && (
                <img src ={avatar} style={{
                    height:'60px',
                    width:'60px',
                    borderRadius:'50%',
                    objectFit:'cover'
                }} alt ="avatar"/>
             )} */}
             {/* <InputForm
            style={{ width:'300px' }} id="avatar"
             value ={avatar} Onchange= {handleOnchangeAvatar}
          />  */}
          {/* <ButtonComponent
          
          onClick={handleUpdate}  
            size={40}
            styleButton={{
              
              height: "30px",
              width: "fit-content",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "2px 6px 6px",
            }}
            textButton={"cập nhập"}
            styleTextButton={{
              color: "rgb(26, 148, 255",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
          </WrapperInput> */}
            
          </WrapperContentProfile>
        </div>
    )
}

export default ProfilePage