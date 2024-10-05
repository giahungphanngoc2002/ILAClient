import React from "react";

const CourseCarousel = () => {
    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center">Môn học</h2>
                <p className="text-gray-600 mb-12 text-center">Suspendisse ante mi iaculis ac eleifend id venenatis non eros.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
                    <div className="bg-orange-400 overflow-hidden flex flex-col h-full py-10 px-12 justify-center items-center">
                        <img src="images/toan-hoc.png" alt="Toán học" className="w-[157px] h-[150px] object-cover" />
                        <div className="text-white text-center mt-4 text-xl font-bold">Toán học</div>
                    </div>
                    <div className="bg-neutral-100 overflow-hidden flex flex-col h-full py-10 px-12 justify-center items-center">
                        <img src="images/vat-ly.png" alt="Vật lý" className="w-[157px] h-[150px] object-cover" />
                        <div className="text-black text-center mt-4 text-xl font-bold">Vật lý</div>
                    </div>
                    <div className="bg-yellow-300 overflow-hidden flex flex-col h-full py-10 px-12 justify-center items-center">
                        <img src="images/tieng-anh.png" alt="Tiếng anh" className="w-[157px] h-[150px] object-cover" />
                        <div className="text-white text-center mt-4 text-xl font-bold">Tiếng anh</div>
                    </div>
                    <div className="bg-neutral-100 overflow-hidden flex flex-col h-full py-10 px-12 justify-center items-center">
                        <img src="images/hoa-hoc.png" alt="Hoá học" className="w-[157px] h-[150px] object-cover" />
                        <div className="text-black text-center mt-4 text-xl font-bold">Hoá học</div>
                    </div>
                    <div className="bg-neutral-100 overflow-hidden flex flex-col h-full py-10 px-12 justify-center items-center">
                        <img src="images/lich-su.png" alt="Lịch sử" className="w-[157px] h-[150px] object-cover" />
                        <div className="text-black text-center mt-4 text-xl font-bold">Lịch sử</div>
                    </div>
                    <div className="bg-sky-400 overflow-hidden flex flex-col h-full py-10 px-12 justify-center items-center">
                        <img src="images/dia-ly.png" alt="Địa lý" className="w-[157px] h-[150px] object-cover" />
                        <div className="text-white text-center mt-4 text-xl font-bold">Địa lý</div>
                    </div>
                    <div className="bg-neutral-100 overflow-hidden flex flex-col h-full py-10 px-12 justify-center items-center">
                        <img src="images/sinh-hoc.png" alt="Sinh học" className="w-[157px] h-[150px] object-cover" />
                        <div className="text-black text-center mt-4 text-xl font-bold">Sinh học</div>
                    </div>
                    <div className="bg-blue-500 overflow-hidden flex flex-col h-full py-10 px-12 justify-center items-center">
                        <img src="images/ngu-van.png" alt="Ngữ văn" className="w-[157px] h-[150px] object-cover" />
                        <div className="text-white text-center mt-4 text-xl font-bold">Ngữ văn</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCarousel;
