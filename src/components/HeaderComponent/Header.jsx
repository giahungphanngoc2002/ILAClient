import React, { useState, useEffect } from 'react';
import { FaPhoneAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SecondaryHeader from './SecondaryHeader';

const Header = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    const handleNavigateLogin = () => {
        navigate("/signin");
    };

    // Lắng nghe sự kiện cuộn của người dùng
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY; // Vị trí cuộn hiện tại
            if (scrollTop > 42) { // Thay đổi giá trị 100 theo ý muốn
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup event listener khi component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="w-full flex flex-col">
            {/* Ẩn phần SecondaryHeader khi cuộn */}
            {!isScrolled && <SecondaryHeader />}

            <div className={`w-full bg-[#fff] h-[65px] shadow-xl top-0 left-0 z-50 ${isScrolled ? 'fixed' : 'relative'}`}>
                <div className="relative container xl:max-w-[1140px] mx-auto upper-header box-border h-full flex justify-between items-center">
                    <Link to="/" className="flex items-center justify-center no-underline">
                        <p className="text-4xl m-0 text-blue-600 tracking-widest font-bold">ILA</p>
                        <img src="images/logoILA.png" alt="Logo" className="h-16 scale-150" />
                    </Link>

                    {/* Main Menu */}
                    <div className="lg:flex justify-center items-center h-full hidden">
                        <div className="items-center h-full flex">
                            <div className="menu md:w-[460px] md:h-full flex justify-between h-full">
                                <div className="relative flex items-center justify-center text-activeBtn group">
                                    <button className="font-semibold text-[14px]" aria-current="page">
                                        Trang chủ
                                    </button>
                                </div>

                                <div className="relative flex items-center justify-center text-textBold no-underline group">
                                    <button className="font-semibold text-[14px]">
                                        Giới thiệu
                                    </button>
                                    <i className="ml-1 icon icon-down-open text-[#3D3D47] text-[10px]" />
                                    <div className="absolute rounded-[10px] bg-primary flex flex-col top-[100%] w-[250px] left-[-20px] box-border px-5 py-3 border-1-[#1080EB] hidden group-hover:flex">
                                        <div className="hover:pl-1.5 relative font-semibold text-[14px] cursor-pointer py-1.5 text-[#fff]">
                                            <button className="flex justify-between">
                                                Về chúng tôi
                                            </button>
                                        </div>
                                        <div className="hover:pl-1.5 relative font-semibold text-[14px] cursor-pointer py-1.5 text-[#fff]">
                                            <button className="flex justify-between">
                                                Giới thiệu về Fschool
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tin tức */}
                                <div className="relative flex items-center justify-center text-textBold group">
                                    <button className="font-semibold text-[14px]">
                                        Tin tức
                                    </button>
                                    <i className="ml-1 icon icon-down-open text-[#3D3D47] text-[10px]" />
                                    <div className="absolute rounded-[10px] bg-primary flex flex-col top-[100%] w-[250px] left-[-20px] box-border px-5 py-3 border-1-[#1080EB] hidden group-hover:flex">
                                        <div className="hover:pl-1.5 relative font-semibold text-[14px] cursor-pointer py-1.5 text-[#fff]">
                                            <button className="flex justify-between">
                                                Tin giáo dục
                                            </button>
                                        </div>
                                        <div className="hover:pl-1.5 relative font-semibold text-[14px] cursor-pointer py-1.5 text-[#fff]">
                                            <button className="flex justify-between">
                                                Tin tuyển sinh
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Học liệu */}
                                <div className="relative flex items-center justify-center text-textBold group">
                                    <button className="font-semibold text-[14px]">
                                        Học liệu
                                    </button>
                                    <i className="ml-1 icon icon-down-open text-[#3D3D47] text-[10px]" />
                                    <div className="absolute rounded-[10px] bg-primary flex flex-col top-[100%] w-[250px] left-[-20px] box-border px-5 py-3 border-1-[#1080EB] hidden group-hover:flex">
                                        <div className="hover:pl-1.5 relative font-semibold text-[14px] cursor-pointer py-1.5 text-[#fff]">
                                            <button className="flex justify-between">
                                                Chuyên đề học tập
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tra cứu điểm */}
                                <div className="relative flex items-center justify-center text-textBold group">
                                    <button className="font-semibold text-[14px]">
                                        Tra cứu điểm
                                    </button>
                                    <i className="ml-1 icon icon-down-open text-[#3D3D47] text-[10px]" />
                                    <div className="absolute rounded-[10px] bg-primary flex flex-col top-[100%] w-[250px] left-[-20px] box-border px-5 py-3 border-1-[#1080EB] hidden group-hover:flex">
                                        <div className="hover:pl-1.5 relative font-semibold text-[14px] cursor-pointer py-1.5 text-[#fff]">
                                            <button className="flex justify-between">
                                                Tra cứu điểm THPT
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hotline and Login */}
                    <div className="text-[16px] sm:text-[16px] font-semibold flex items-center">
                        <div className="flex items-center rounded-full justify-center w-[30px] h-[30px] mr-[9px] bg-lightPrimary">
                            <i className="icon icon-phone" style={{ color: '#fff' }} />
                        </div>

                        <div className="flex lg:flex-row flex-nowrap items-center">
                            <div className="rounded-full p-2 mr-1" style={{ backgroundColor: "#56CCF2" }}>
                                <FaPhoneAlt className="text-white" />
                            </div>
                            <div className="mr-1 textBold whitespace-nowrap">Hotline:</div>
                            <p className="textBold whitespace-nowrap m-0">083 8888 966</p>
                        </div>
                    </div>

                    <button className="rounded-[37px] text-[#fff] lg:flex uppercase text-[14px] font-semibold lg:w-[150px] h-[45px] justify-center items-center"
                        onClick={handleNavigateLogin}
                        style={{ backgroundColor: "#F47E1F" }}
                    >
                        Đăng nhập
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden flex justify-center">
                    <input id="toggleMenu" type="checkbox" className="hidden" />
                    <label htmlFor="toggleMenu">
                        <div id="hamburger-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Header;
