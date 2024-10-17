import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { updateUser } from "../../redux/slices/userSlide";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignInPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isSuccess, isError, error } = mutation;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    if (isSuccess && data?.status !== "ERR") {
      toast.success("Đăng nhập thành công");

      const accessToken = data?.access_token;
      if (accessToken && typeof accessToken === "string") {
        localStorage.setItem("access_token", JSON.stringify(accessToken));

        try {
          const decoded = jwt_decode(accessToken);
          if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, accessToken);
          }
        } catch (error) {
          console.error("Error decoding JWT:", error.message);
        }
      } else {
        console.error("Invalid access token:", accessToken);
      }

      if (data?.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (data?.role === "Teacher") {
        navigate("/manage");
      } else {
        navigate("/student");
      }
    } else if (isError) {
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại");
    }
  }, [isSuccess, isError, data, error, navigate]);


  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      toast.error("Không thể lấy thông tin người dùng");
    }
  };

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  const handleSignin = (e) => {
    e.preventDefault();
    mutation.mutate({
      email,
      password,
    });
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

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
            <span
              onClick={() => handleLinkClick("/signin")}
              className={`cursor-pointer font-bold ${activeLink === "/signin" ? "text-blue-600" : "text-gray-600"} hover:text-blue-800 transition-colors duration-200`}
            >
              Đăng nhập
            </span>
            <span
              onClick={() => handleLinkClick("/signup")}
              className={`cursor-pointer ${activeLink === "/signup" ? "text-blue-600" : "text-gray-600"} hover:text-blue-800 transition-colors duration-200`}
            >
              Đăng ký
            </span>
          </div>
          <form onSubmit={handleSignin} className="space-y-4">
            <input
              className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none"
              type="email"
              name="email"
              value={email}
              onChange={handleOnChangeEmail}
              placeholder="Địa chỉ Email"
              required
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
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Đăng nhập
              </button>
              <Link
                to="/requestPasswordReset"
                className="text-sm text-blue-500 hover:underline"
                style={{ textDecoration: "none" }}
              >
                Quên mật khẩu?
              </Link>
            </div>
          </form>
          <div className="flex items-center justify-center space-x-4 mt-14">
            <span className="text-gray-500">Hoặc đăng nhập bằng</span>
            <a
              href="#"
              className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700 transition duration-200 flex items-center justify-center w-12 h-12"
            >
              <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
            </a>
            <a
              href="#"
              className="rounded-full bg-red-500 p-3 text-white hover:bg-red-600 transition duration-200 flex items-center justify-center w-12 h-12"
            >
              <FontAwesomeIcon icon={faGoogle} className="text-lg" />
            </a>
            <a
              href="#"
              className="rounded-full bg-gray-800 p-3 text-white hover:bg-gray-700 transition duration-200 flex items-center justify-center w-12 h-12"
            >
              <FontAwesomeIcon icon={faGithub} className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}