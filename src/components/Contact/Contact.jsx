import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái gửi
    const [responseMessage, setResponseMessage] = useState(""); // Thông báo sau khi gửi

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra xem có thiếu thông tin không
        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            setResponseMessage("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        setIsSubmitting(true); // Bắt đầu trạng thái gửi

        // Gửi dữ liệu lên backend
        try {
            const response = await fetch("http://localhost:3001/api/contact/contact", { // Đảm bảo đúng URL backend
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // Nếu phản hồi không OK, đưa ra lỗi chi tiết hơn
                const errorData = await response.json();
                throw new Error(errorData.message || "Lỗi khi gửi yêu cầu.");
            }

            const result = await response.json();
            setResponseMessage(result.message || "Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");

        } catch (error) {
            setResponseMessage(`Lỗi: ${error.message}`);
        }

        setIsSubmitting(false); // Kết thúc trạng thái gửi
    };

    return (
        <div id="contact" className="w-full flex flex-col bg-primary">
            <div
                className="footer-upper w-full"
                style={{
                    backgroundImage: `url('/images/footer-upper-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="xl:max-w-[1140px] container mx-auto flex flex-col-reverse lg:flex-row w-full box-border h-auto lg:h-[612px]">
                    <div className="lg:relative justify-center w-full lg:w-1/2 h-auto flex">
                        <img
                            src="/images/footer-student.png"
                            alt="footer-student"
                            loading="lazy"
                            className="hidden lg:block lg:absolute bottom-0 right-[95px]"
                        />
                    </div>
                    <div className="flex flex-col w-full xl:w-1/2 p-5 lg:p-0">
                        <div className="w-full lg:w-[560px] lg:mt-[72px]">
                            <div className="text-white text-center md:text-left">
                                <div className="font-bold text-[40px] mb-[9px]">
                                    Đăng ký nhận tư vấn
                                </div>
                                <div className="font-semibold text-[16px] mb-[18px]">
                                    Kính mời quý nhà trường, phụ huynh &amp; học sinh để lại thông tin để nhận tư vấn miễn phí về giải pháp của chúng tôi
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col w-full mb-[15px]">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Họ tên"
                                        className="appearance-none box-border pl-[13px] rounded-[5px] w-full h-[55px] pt-[17px] pb-[18px] text-[15px] text-textNormal outline-none"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex flex-col w-[48%] mb-[15px]">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            className="appearance-none box-border pl-[13px] rounded-[5px] w-full h-[55px] pt-[17px] pb-[18px] text-[15px] text-textNormal outline-none"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex flex-col w-[48%] mb-[15px]">
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Số điện thoại"
                                            className="appearance-none box-border pl-[13px] rounded-[5px] w-full h-[55px] pt-[17px] pb-[18px] text-[15px] text-textNormal outline-none"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full mb-[15px]">
                                    <textarea
                                        name="message"
                                        placeholder="Để lại lời nhắn cho chúng tôi"
                                        className="appearance-none box-border pl-3 resize-none rounded-[5px] w-full h-[120px] pt-[10px] text-[15px] text-textNormal outline-none"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="w-full flex justify-end xl:w-[560px]">
                                    <button
                                        style={{ backgroundColor: "#F47E1F" }}
                                        type="submit"
                                        className="rounded-[5px] w-[100%] md:w-[177px] h-[55px] flex items-center font-bold justify-center text-white text-[15px]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Đang gửi..." : "Gửi Đăng Ký"}
                                    </button>
                                </div>
                            </form>

                            {/* Thông báo sau khi gửi */}
                            {responseMessage && (
                                <div className="mt-4 text-white font-bold">
                                    {responseMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
