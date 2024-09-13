import React, { useState, useEffect } from "react";
import { Button, Popover } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slices/userSlide";
import ChatboxButton from "./ChatboxButton"; // Adjust the path as necessary

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
      <div
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-transparent pt-2"
          }`}
      >
        <div className="flex justify-between items-center px-8 font-poppins">
          <Link
            to="/"
            className="flex items-center text-purple-700 text-2xl font-bold no-underline"
          >
            <img
              src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/62fa6419161d3a641f681ceb_Logo.svg"
              alt="Logo"
              className="h-10 mr-3"
            />
          </Link>
          <nav className="hidden md:flex space-x-8">
            <a
              href=""
              className="flex items-center text-lg text-gray-700 hover:text-purple-700 no-underline transition duration-300 hover:border-b-2 hover:border-blue-300"
            >
              <img
                src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/632b579034dcb77743b131fb_School.svg"
                alt=""
                className="h-6 mr-2"
              />
              Overview
            </a>
            <a
              href="#"
              className="flex items-center text-lg text-gray-700 hover:text-purple-700 no-underline transition duration-300 hover:border-b-2 hover:border-blue-300"
            >
              <img
                src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6332064ac11c2a5449906881_file-certificate%201.svg"
                alt=""
                className="h-6 mr-2"
              />
              Certified Educators
            </a>
            <a
              href="#"
              className="flex items-center text-lg text-gray-700 hover:text-purple-700 no-underline transition duration-300 hover:border-b-2 hover:border-blue-300"
            >
              <img
                src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6332067bc211b1ca44d7d167_newspaper%201.svg"
                alt=""
                className="h-6 mr-2"
              />
              Blog
            </a>
            <a
              href="#"
              className="flex items-center text-lg text-gray-700 hover:text-purple-700 no-underline transition duration-300 hover:border-b-2 hover:border-blue-300"
            >
              <img
                src="https://cdn.prod.website-files.com/61fd8e9c8085651f81824642/63a0c1a3d731a36274c4ef89_school%203.svg"
                alt=""
                className="h-6 mr-2"
              />
              Resources
            </a>
            <a
              onClick={handlequizai}
              className="flex items-center text-lg text-gray-700 hover:text-purple-700 no-underline transition duration-300 hover:border-b-2 hover:border-blue-300"
            >
              <img
                src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/64da76ec93a656777d37aa74_Quizizz%20AI%20Sparkle.png"
                alt=""
                className="h-6 mr-2"
              />
              Quizizz AI
            </a>
          </nav>

          <div className="hidden md:flex space-x-6 items-center">
            <Button className="border border-blue-700 text-black text-lg flex items-center px-3 py-2">
              <img
                src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/6332067bba88a96b771afce0_user-headset%201.svg"
                alt=""
                className="h-6 mr-2"
              />
              Help Center
            </Button>
            {user?.access_token ? (
              <Popover content={content} trigger="click">
                <div className="flex items-center cursor-pointer space-x-2">
                  <img
                    src={user?.avatar}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-lg font-medium">
                    {userName?.length ? userName : user?.name ? user?.name : user?.email}
                  </div>
                </div>
              </Popover>
            ) : (
              <>
                <Button
                  onClick={handleNavigateLogin}
                  className="border border-blue-700 text-black text-lg flex items-center px-3 py-2"
                >
                  <img
                    src="https://cdn.prod.website-files.com/61fd8e9c8085651f81824642/63a0c259ae3f133ca53c3e86_user-plus%201.svg"
                    alt=""
                    className="h-6 mr-2"
                  />
                  Log in
                </Button>
                <Button
                  onClick={handleNavigateSignup}
                  type="primary"
                  className="bg-white text-black border-blue-200 text-lg flex items-center px-3 py-2"
                >
                  <img
                    src="https://cdn.prod.website-files.com/60aca2b71ab9a5e4ececf1cf/632b57e283d43912e086909f_chalkboard-user%2010.svg"
                    alt=""
                    className="h-6 mr-2"
                  />
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden bg-white shadow-md">
            <nav className="flex flex-col items-center space-y-4 py-4">
              <a
                href="#"
                className="text-lg text-gray-700 hover:text-purple-700 no-underline"
              >
                For Schools
              </a>
              <a
                href="#"
                className="text-lg text-gray-700 hover:text-purple-700 no-underline"
              >
                Plans
              </a>
              <a
                href="#"
                className="text-lg text-gray-700 hover:text-purple-700 no-underline"
              >
                Solutions
              </a>
              <a
                href="#"
                className="text-lg text-gray-700 hover:text-purple-700 no-underline"
              >
                Resources
              </a>
              <a
                href="#"
                className="text-lg text-gray-700 hover:text-purple-700 no-underline"
              >
                For Business
              </a>
              {user?.access_token && user?.isTeacher && (
                <Button
                  onClick={handleClick}
                  className="border border-purple-700 text-purple-700 text-lg flex items-center px-3 py-2"
                >
                  All Messages
                </Button>
              )}
              {user?.access_token && !user?.isTeacher && (
                <Button
                  onClick={handleClick}
                  className="border border-purple-700 text-purple-700 text-lg flex items-center px-3 py-2"
                >
                  Messages
                </Button>
              )}
              <Button className="border border-purple-700 text-purple-700 text-lg flex items-center px-3 py-2">
                Enter code
              </Button>
              {user?.access_token ? (
                <Popover content={content} trigger="click">
                  <div className="flex items-center cursor-pointer space-x-2">
                    <img
                      src={user?.avatar}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-lg font-medium">
                      {userName?.length ? userName : user?.email}
                    </div>
                  </div>
                </Popover>
              ) : (
                <>
                  <Button
                    onClick={handleNavigateLogin}
                    className="border border-purple-700 text-purple-700 text-lg flex items-center px-3 py-2"
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={handleNavigateSignup}
                    type="primary"
                    className="bg-purple-700 text-white text-lg flex items-center px-3 py-2"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
      <div className="pt-16">
        {" "}
        {/* Adjust the padding-top based on your navbar height */}
        {/* Nội dung chính của trang */}
      </div>

    </>
  );
}