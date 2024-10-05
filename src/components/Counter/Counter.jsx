import React from 'react';
import { FaBook } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaSchool } from "react-icons/fa";

const StatsSection = () => {
    const stats = [
        {
            id: 1,
            icon: <FaBook />,
            number: '1M+',
            label: 'tài liệu học tập',
        },
        {
            id: 2,
            icon: <FaSchool />,
            number: '320+',
            label: 'đơn vị sử dụng',
        },
        {
            id: 3,
            icon: <GiTeacher />,
            number: '1340+',
            label: 'giáo viên tin tưởng',
        },
        {
            id: 4,
            icon: <PiStudent />,
            number: '10K+',
            label: 'học sinh tiếp cận',
        },
    ];

    return (
        <div
            className="w-full h-[500px] box-border py-7 flex flex-col items-center justify-center z-40"
            style={{
                backgroundImage: "url('/images/learning.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="w-full flex flex-col justify-center items-center">
                <div className="uppercase font-normal text-[16px] text-[#fff]">
                    Xây dựng giá trị
                </div>
                <p className="font-bold text-[40px] text-[#fff] text-center md:text-left leading-[48px] md:leading-[60px] my-3 md:my-0">
                    Nỗ lực không ngừng nghỉ
                </p>
                <div className="font-normal text-[16px] w-full xl:max-w-[624px] text-[#fff] text-center max-w-[50%]">
                    Những con số biết nói
                </div>
                <div className="w-full xl:max-w-[1140px] mt-[45px] grid gap-4 xl:grid-rows-1 xl:grid-cols-4 md:grid-cols-2 grid-cols-1 px-5 md:px-0">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="flex bg-[#fff] rounded-[6px] p-[10px] box-border w-full h-[100px]"
                        >
                            <div className="rounded-[6px] w-[80px] h-[80px] bg-blue-600 text-white text-3xl flex items-center justify-center mr-[14px]">
                                {stat.icon}
                            </div>
                            <div className="text-textBold flex flex-col">
                                <div className="font-bold text-[28px]">{stat.number}</div>
                                <div className="uppercase font-semibold text-[14px]">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default StatsSection;
