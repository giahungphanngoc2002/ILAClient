import React from "react";
import { Button, Col, Popover } from "antd";
import { WrapperContentPopup, WrapperHeader } from "./style";
import Search from "antd/es/input/Search";
import { AudioOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from '../../services/UserService'
import { resetUser } from "../../redux/slices/userSlide";
export default function HeaderComponent() {
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );
  const navigate =useNavigate()
  const user =useSelector((state)=> state.user)
  const dispatch = useDispatch();
  const handleLogout = async() =>{
    await UserService.logoutUser()
    dispatch(resetUser())
  }
  const content =( 
 <div>
  <WrapperContentPopup onClick={handleLogout} >đăng xuất</WrapperContentPopup>
  <WrapperContentPopup>Profile</WrapperContentPopup>
 </div>
  )
  const handleNavigateLogin =() =>{
    navigate( '/signin')
  }
  const handleNavigateSignup =() =>{
    navigate( '/signup')
  }
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  return (
    <div>
      <WrapperHeader>
        <Col span={6} style={{color:'rgb(26,119,255)'}} className="d-flex align-items-center fs-1 fw-bold">LOGO</Col>
        <Col span={12}>
          <Search
            placeholder="Hỏi bất cứ điều gì bạn muốn"
            enterButton="Search"
            size="large"
            suffix={suffix}
            onSearch={onSearch}
          />
        </Col>
        
        {user?.name ? (
          <>
          
          <Popover content={content} trigger="click">
          <div style={{cursor :'pointer' ,padding: '10px 10px 0px 100px'}}>{user.name}</div>
          </Popover>
          </>
          
        ):(
          <Col span={6} className="text-end">
          <Button onClick={handleNavigateSignup} style={{ height: "40px" }}>Đăng ký</Button>
          <Button onClick={handleNavigateLogin} type="primary" style={{ height: "40px" }}>
            Đăng nhập
          </Button>
          </Col>
        )}
        
          
        
      </WrapperHeader>
    </div>
  );
}
