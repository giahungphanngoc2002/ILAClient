import React, { useState } from "react";
import * as UserService from "../../services/UserService";
import { toast } from "react-toastify";
import { FiMail } from "react-icons/fi";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await UserService.requestPasswordReset(email);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Yêu cầu đặt lại mật khẩu thất bại.");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-white relative">
      <div className="flex w-full h-full max-w-8xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:block bg-black relative">
          <img
            src="/images/ảnhlogin.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-90"
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-extrabold text-gray-600 italic drop-shadow-lg"
            style={{ transform: "rotate(-25deg) skew(-15deg)" }}
          >
            Educare
          </div>
        </div>
        <div className="w-full ml-[250px] md:w-1/3 p-10 flex flex-col justify-center">
          <h3 className="text-3xl font-extrabold text-gray-600 mb-10   pb-2 text-center">
            Đặt Lại Mật Khẩu
          </h3>
          <p className="text-sm text-black mb-6 text-center">
            Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                className="w-full px-10 py-2 border rounded bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Địa chỉ Email"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
              >
                Gửi Liên Kết Đặt Lại Mật Khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RequestPasswordReset;
