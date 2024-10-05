import React from 'react';
import { MdEmail } from "react-icons/md";
import { IoMdTime } from "react-icons/io";

const SecondaryHeader = () => {
    return (
        <div className="w-full bg-blue-600">
            <div className="container xl:max-w-[1140px] mx-auto box-border py-[11px] flex justify-between">
                <div className="flex text-white sm:flex-row flex-col text-[13px] leading-5">
                    <span className="flex items-center mr-2.5">
                        <IoMdTime className="mr-1 " />
                        Hà Nội, Thứ sáu, 4/10/2024
                    </span>
                    <span className="flex items-center">
                        <MdEmail className="mr-1 " />
                        Email: cskh@ila.vn
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">



                </div>
            </div>
        </div>
    );
};

export default SecondaryHeader;
