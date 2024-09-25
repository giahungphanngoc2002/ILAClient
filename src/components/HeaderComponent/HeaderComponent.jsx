import React, { useState, useEffect } from "react";
import { Button, Popover } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slices/userSlide";
import ChatboxButton from "./ChatboxButton"; // Adjust the path as necessary
import { CiLogin } from "react-icons/ci";
import { PiCashRegisterBold } from "react-icons/pi";
import { FaFacebookF, FaInstagram, FaGoogle, FaLinkedinIn } from "react-icons/fa";

export default function HeaderComponent() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dummy data for testing purposes
  const userId = user?.isTeacher ? user?.userId?._id : user?.id;

  const data = {
    _id: "someId",
    userId: { _id: userId },
  };

  const handleLogout = async () => {
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    dispatch(resetUser());
    navigate("/");
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const handleClick = () => {
    navigate("/teacher-messages");
  };

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigateHomePageTeacher = () => {
    navigate("/teacher");
  };

  const handleNavigateMyClass = () => {
    navigate("/myclass");
  };

  const handleNavigateHistory = () => {
    navigate(`/historyStudent/${user?.id}`);
  };

  const handleNavigateLogin = () => {
    navigate("/signin");
  };

  const handleNavigateSignup = () => {
    navigate("/signup");
  };

  const handlequizai = (id) => {
    navigate("/quizizzAI");
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const content = (
    <div className="">
      {user?.isTeacher && (
        <>
          <div
            onClick={handleNavigateHomePageTeacher}
            className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center space-x-2"
          >
            <img
              src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/632b57a19843187e5697ea32_screen-users%202.svg"
              alt=""
              className="w-6 h-6"
            />
            <span className="text-lg font-medium">HomePageTeacher</span>
          </div>
          <div
            onClick={handleNavigateMyClass}
            className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center space-x-2"
          >
            <img
              src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6616ab3c7cd6c1a7502419cb_Accommodations%20Icon.svg"
              alt=""
              className="w-6 h-6"
            />
            <span className="text-lg font-medium">MyClass</span>
          </div>
        </>
      )}
      {!user?.isTeacher && (
        <>
          <div
            onClick={handleNavigateHistory}
            className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center space-x-2"
          >
            <img
              src="https://cdn.prod.website-files.com/61fd8e9c8085651f81824642/63a0c2228f6be943d26d2167_poll-people%201.svg"
              alt=""
              className="w-6 h-6"
            />
            <span className="text-lg font-medium">History</span>
          </div>
          <div
            onClick={handleNavigateHomePageTeacher}
            className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center space-x-2"
          >
            <img
              src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/632b57a19843187e5697ea32_screen-users%202.svg"
              alt=""
              className="w-6 h-6"
            />
            <span className="text-lg font-medium">HomePageTeacher</span>
          </div>
          <div
            onClick={handleNavigateMyClass}
            className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center space-x-2"
          >
            <img
              src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6616ab3c7cd6c1a7502419cb_Accommodations%20Icon.svg"
              alt=""
              className="w-6 h-6"
            />
            <span className="text-lg font-medium">MyClass</span>
          </div>
        </>
      )}
      <div
        onClick={handleNavigateProfile}
        className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center space-x-2"
      >
        <img
          src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/634da75db10c7c7261936c80_ballot-check%202.svg"
          alt=""
          className="w-6 h-6"
        />
        <span className="text-lg font-medium">Profile</span>
      </div>
      <div
        onClick={handleLogout}
        className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center space-x-2"
      >
        <img
          src="https://cdn.prod.website-files.com/61fd8e9c8085651f81824642/639ccfc5a4494136ca882b4c_user-group%202.svg"
          alt=""
          className="w-6 h-6"
        />
        <span className="text-lg font-medium">Đăng Xuất</span>
      </div>
    </div>
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="absolute bg-black top-0 w-full z-50">
        {/* Top Links */}
        <div className="container mx-auto pt-3 pb-1 text-sm text-gray-400 flex justify-between">
          <div className="hidden md:block">Call: +1 123 456 7890</div>
          <div className="flex space-x-4">
            {user?.access_token ? (
              <Popover content={content} trigger="click">
                <div className="flex items-center cursor-pointer space-x-2">
                  <img
                    src={user?.avatar}
                    alt="User"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    {userName?.length ? userName : user?.name ? user?.name : user?.email}
                  </div>
                </div>
              </Popover>
            ) : (
              <>
                <button className="text-sm text-gray-300 inline-flex items-center" onClick={handleNavigateLogin}>
                  <CiLogin className="mr-2" /> Login
                </button>
                <button className="text-sm text-gray-300 inline-flex items-center ml-4" onClick={handleNavigateSignup}>
                  <PiCashRegisterBold className="mr-2" /> Register
                </button>
              </>
            )}
            <span>|</span>
            <button className="hover:text-gray-400 text-sm text-gray-300"><FaFacebookF /></button>
            <button className="hover:text-gray-400 text-sm text-gray-300"><FaInstagram /></button>
            <button className="hover:text-gray-400 text-sm text-gray-300"><FaGoogle /></button>
            <button className="hover:text-gray-400 text-sm text-gray-300"><FaLinkedinIn /></button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="bg-transparent">
          <div className="container mx-auto flex justify-between items-center py-1">
            <div className="logo">
              <Link to="/" className="flex items-center justify-center no-underline">
                <p className="text-4xl m-0 text-white tracking-widest font-bold">ILA</p>
                <img src="images/logoILA.png" alt="Logo" className="h-16 scale-150" />
              </Link>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button className="text-gray-200 hover:text-gray-200" onClick={() => window.location.href = 'index-2.html'}>Home</button>
              <button className="text-gray-400 hover:text-gray-200" onClick={() => window.location.href = 'about-us.html'}>About Us</button>
              <div className="relative group">
                <button className="text-gray-400 hover:text-gray-200">Courses</button>
                <div className="absolute left-0 hidden group-hover:block bg-white shadow-md mt-2">
                  <button className="block px-4 py-2 text-sm text-gray-400" onClick={() => window.location.href = 'courses.html'}>Grid View</button>
                  <button className="block px-4 py-2 text-sm text-gray-400" onClick={() => window.location.href = 'courses1.html'}>List View</button>
                  <button className="block px-4 py-2 text-sm text-gray-400" onClick={() => window.location.href = 'courses2.html'}>Single Course</button>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-200" onClick={() => window.location.href = 'our-team.html'}>Our Team</button>
              <button className="text-gray-400 hover:text-gray-200" onClick={() => window.location.href = 'blog.html'}>Blog</button>
              <button className="text-gray-400 hover:text-gray-200" onClick={() => window.location.href = 'contact.html'}>Contact Us</button>
            </nav>
          </div>
        </div>
      </div>

      {/* Add padding to push the content down */}
      <div className="pt-[112px]">
        {/* Main content here */}

      </div>
    </>
  );

}