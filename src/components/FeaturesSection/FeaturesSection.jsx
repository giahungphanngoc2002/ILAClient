import React from "react";
import { TiTick } from "react-icons/ti";
import { FaLightbulb } from "react-icons/fa";

const features = [
    {
        id: 1,
        icon: "/_ipx/f_webp/composing.png",
        title: "Tài nguyên học liệu phong phú",
        description: [
            "Sử dụng AI để tạo ra câu hỏi hỗ trợ trong việc học",
            "Toàn bộ các môn có trong chương trình khung của Bộ giáo dục và đào tạo.",
            "Phân chia kiến thức theo khối lớp và môn học rõ ràng.",
        ],
    },
    {
        id: 2,
        icon: "/_ipx/f_webp/bank.png",
        title: "Số hóa học liệu nhanh chóng đơn giản",
        description: [
            "Hệ thống tích hợp sẵn công cụ số hoá tài liệu.",
            "Chỉnh sửa trực tiếp; tuỳ chỉnh XUẤT, LƯU file để sử dụng cho trường lớp.",
            "Giảm đến 80% thời gian soạn giáo án và đề thi của Giáo viên.",
        ],
    },
    {
        id: 3,
        icon: "/_ipx/f_webp/result.png",
        title: "Tối ưu việc tạo đề thi cho giáo viên",
        description: [
            "Xây dựng đề thi nhanh chóng chỉ với vài thao tác.",
            "Tuỳ chỉnh Mạch nội dung, Cây kiến thức.",
            "Tuỳ chỉnh độ khó của đề thi.",
            "Tự động tạo đề dựa trên Ma trận.",
            "Tuỳ chọn ngân hàng đề thi từ Fshool, trường, hoặc kho đề cá nhân.",
        ],
    },
    {
        id: 4,
        icon: "/_ipx/f_webp/pc.png",
        title: "Ứng dụng công nghệ Adaptive Learning",
        description: [
            "Cá nhân hóa lộ trình học tập cho từng học sinh.",
            "Học sinh dễ dàng ôn luyện dựa trên hệ thống đề có sẵn.",
            "Hệ thống gợi ý phương án cải thiện tình hình học tập với từng học sinh.",
        ],
    },
];

const FeaturesSection = () => {
    return (
        <div className="flex w-full mb-20">
            <div className="container xl:max-w-[1140px] mx-auto flex flex-col items-center mt-20">
                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center mb-10">
                    <h2 className="font-bold text-[40px] text-gray-800 leading-[45px] md:leading-[60px]">
                        Các tính năng ưu việt
                    </h2>
                </div>

                {/* Feature Sections */}
                <div

                    className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            style={{ backgroundColor: "#F9F9F9" }}
                            className="flex flex-col gradientBox h-auto rounded-2xl p-6"
                        >
                            <div className="flex items-center mb-6">
                                <div className="min-w-[64px] relative h-[64px] rounded-full  flex items-center justify-center mr-2">
                                    <FaLightbulb style={{ color: "#F47E1F" }} className="text-4xl" />
                                </div>
                                <h3 className="font-semibold text-[22px] text-gray-800">
                                    {feature.title}
                                </h3>
                            </div>
                            {feature.description.map((desc, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <TiTick className="text-xl mr-2" style={{ color: "#F47E1F" }} />
                                    <p className="font-normal text-[16px] text-gray-700 m-0">
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
