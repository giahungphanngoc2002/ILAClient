import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  

  // Mutation hook to handle sign-up requests
  const mutation = useMutationHooks((data) => UserService.signupUser(data));
  const { data, isSuccess, isError, error } = mutation;

  // Handle input changes
  const handleOnChangeUsername = (e) => setUsername(e.target.value);
  const handleOnChangePassword = (e) => setPassword(e.target.value);
  const handleOnChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);

  // Handle sign-up form submission
  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu và mật khẩu xác nhận không khớp.");
      return;
    }
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    mutation.mutate({
      username: username.trim(),
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
    });
  };

  // Effect to handle sign-up success or failure
  useEffect(() => {
    if (isError) {
      toast.error("Đăng ký thất bại, vui lòng thử lại.");
      console.error("Lỗi đăng ký:", error);
    } else if (isSuccess && data?.status !== "ERR") {
      toast.success("Đăng ký thành công!");
      navigate("/signin");
    }
  }, [isSuccess, isError, data, error, navigate]);

  // Toggle password visibility
  const togglePasswordVisibility = () => setVisible(!visible);

  return (
    <section className="w-full h-screen flex items-center justify-center bg-white relative">
      <div className="flex w-full h-full max-w-8xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:block bg-black relative">
          <img
            src="/images/anhlogin.jpg"
            alt="Nền"
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
          <h3 className="text-3xl font-extrabold text-gray-600 mb-10 border-b-4 border-blue-500 pb-2">
            Chào mừng bạn đến với nền tảng <span className="text-blue-600">Educare</span> của chúng tôi.
          </h3>
          <p className="text-sm text-black mb-6">
            Khám phá nền tảng học tập trực tuyến hiện đại, giúp bạn chinh phục tri thức và mở ra tương lai tươi sáng.
          </p>
          <div className="flex space-x-4 mb-6">
            <Link
              to="/signin"
              className="text-blue-600 font-bold hover:text-blue-800 transition-colors duration-200"
              style={{ textDecoration: 'none' }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/signup"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              style={{ textDecoration: 'none' }}
            >
              Đăng ký
            </Link>
          </div>
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none"
              type="text"
              name="username"
              value={username}
              onChange={handleOnChangeUsername}
              placeholder="username"
            />
            <div className="relative">
              <input
                className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none"
                type={visible ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChangePassword}
                placeholder="Mật khẩu"
                required
              />
              <div
                className="absolute top-2 right-3 text-gray-600 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {visible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
            <div className="relative">
              <input
                className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none"
                type={visible ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChangeConfirmPassword}
                placeholder="Xác nhận Mật khẩu"
                required
              />
              <div
                className="absolute top-2 right-3 text-gray-600 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {visible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:bg-blue-700 transition duration-200"
              >
                Đăng ký
              </button>
              <Link
                to="/requestPasswordReset"
                className="text-sm text-blue-500 hover:underline"
                style={{ textDecoration: 'none' }}
              >
                Quên mật khẩu?
              </Link>
            </div>
          </form>
          <div className="flex items-center justify-center space-x-4 mt-14">
            <span className="text-gray-500">Hoặc đăng ký bằng</span>
            <a
              href="#"
              className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700 active:bg-blue-800 transition duration-200 flex items-center justify-center w-12 h-12"
            >
              <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
            </a>
            <a
              href="#"
              className="rounded-full bg-red-500 p-3 text-white hover:bg-red-600 active:bg-red-700 transition duration-200 flex items-center justify-center w-12 h-12"
            >
              <FontAwesomeIcon icon={faGoogle} className="text-lg" />
            </a>
            <a
              href="#"
              className="rounded-full bg-gray-800 p-3 text-white hover:bg-gray-700 active:bg-gray-900 transition duration-200 flex items-center justify-center w-12 h-12"
            >
              <FontAwesomeIcon icon={faGithub} className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
