import React from 'react';
import { CiLogin } from "react-icons/ci";
import { PiCashRegisterBold } from "react-icons/pi";
import { FaFacebookF, FaInstagram, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <div className="absolute top-0 w-full z-50">

            {/* <div className="container mx-auto py-3 text-sm text-gray-400 flex justify-between">
                <div className="hidden md:block">Call: +1 123 456 7890</div>
                <div className="flex space-x-4">
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
                            <button className="text-sm text-gray-300 inline-flex items-center">
                                <CiLogin className="mr-2" /> Login
                            </button>
                            <button className="text-sm text-gray-300 inline-flex items-center ml-4">
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


            <div className="bg-transparent">
                <div className="container mx-auto flex justify-between items-center py-3">
                    <div className="logo">
                        <Link
                            to="/"
                        >
                            <img src="images/logo.png" alt="Logo" className="h-16" />
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-6">
                        <button className="text-gray-200 hover:text-gray-200" onclick="window.location.href='index-2.html'">Home</button>
                        <button className="text-gray-400 hover:text-gray-200" onclick="window.location.href='about-us.html'">About Us</button>
                        <div className="relative group">
                            <button className="text-gray-400 hover:text-gray-200">Courses</button>
                            <div className="absolute left-0 hidden group-hover:block bg-white shadow-md mt-2">
                                <button className="block px-4 py-2 text-sm text-gray-400" onclick="window.location.href='courses.html'">Grid View</button>
                                <button className="block px-4 py-2 text-sm text-gray-400" onclick="window.location.href='courses1.html'">List View</button>
                                <button className="block px-4 py-2 text-sm text-gray-400" onclick="window.location.href='courses2.html'">Single Course</button>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-200" onclick="window.location.href='our-team.html'">Our Team</button>
                        <button className="text-gray-400 hover:text-gray-200" onclick="window.location.href='blog.html'">Blog</button>
                        <button className="text-gray-400 hover:text-gray-200" onclick="window.location.href='contact.html'">Contact Us</button>

                    </nav>
                </div>
            </div> */}
        </div>
    );
};

export default Header;
