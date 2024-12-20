import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/MessageComponent/Message";
import { updateUser } from "../../redux/slices/userSlide";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { TbPhotoEdit, TbArrowsExchange } from "react-icons/tb";
import { BiUpload, BiTrash } from "react-icons/bi";
import ProfileOverview from "./ProfileOverview";
import ProfileEdit from "./ProfileEdit";
import ChangePassword from "../ChangePassWord/ChangePassWord";
import InfoContact from "./InfoContact";
import { FaHouseUser } from "react-icons/fa";
import InfoAccount from "../InfoAccount/InfoAccount.jsx";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState("123456");
  const [cccd, setCccd] = useState("");
  const [gender, setGender] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState("edit-profile");
  const [nameIC, setNameIC] = useState();
  const [phoneIC, setPhoneIC] = useState();
  const [emailIC, setEmailIC] = useState();
  const [cccdIC, setCccdIC] = useState();
  const [typeIC, setTypeIC] = useState();
  const [userId, setUserId] = useState();
  const [infoContact, setInfoContact] = useState([]);
  const [isLoadingInfoContact, setIsLoadingInfoContact] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setUserId(user?.id);
  }, [user?.id]);

  console.log(userId)
  useEffect(() => {
    const fetchInfoContact = async () => {
      try {

        const response = await UserService.getInfoContactByUserId(userId);
        console.log(response); // Kiểm tra phản hồi từ API
        setInfoContact(response); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Failed to fetch InfoContact:", error.message);
      }
    };

    if (userId) {
      fetchInfoContact(); // Chỉ gọi API khi userId đã có
    }
  }, [userId]); // Gọi lại khi userId thay đổi

  useEffect(() => {
console.log("InfoContact:", infoContact); // Theo dõi sự thay đổi của infoContact
  }, [infoContact]);

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    return UserService.updateUser(id, rests, access_token);
  });

  const passwordMutation = useMutationHooks((data) => {
    const { id, access_token, currentPassword, newPassword } = data;
    return UserService.updatePassword(
      id,
      { currentPassword, newPassword },
      access_token
    );
  });

  const { data, isSuccess, isError } = mutation;
  const {
    data: passwordData,
    isSuccess: isPasswordSuccess,
    isError: isPasswordError,
  } = passwordMutation;

  useEffect(() => {
    if (isSuccess && data?.status !== "ERROR") {
      handleGetDetailsUser(user?.id, user?.access_token);
      setIsLoading(false);
    } else if (isError || data?.status === "ERROR") {
      toast.error("Failed to update user information");
      setIsLoading(false);
    }

    if (isPasswordSuccess && passwordData?.status !== "ERROR") {
      toast.success("Thay đổi mật khẩu thành công!");
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } else if (
      isPasswordError ||
      (isPasswordSuccess && passwordData?.status === "ERROR")
    ) {
      toast.error("lỗi khi thay đổi mật khẩu");
      setIsUpdatingPassword(false);
    }
  }, [isSuccess, isError, isPasswordSuccess, isPasswordError]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token);
    dispatch(updateUser({ ...res.data, access_token: token }));
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.status === "OK") {
        handleGetDetailsUser(user?.id, user?.access_token);
        setIsLoading(false);
      } else if (data?.status === "ERR") {
        // Hiển thị lỗi từ backend (message trong response)
        toast.error(data?.message || "Failed to update user information");
        setIsLoading(false);
      }
    } else if (isError && data?.message) {
      // Hiển thị lỗi nếu xảy ra lỗi không mong đợi
      toast.error(data?.message || "An unknown error occurred");
      setIsLoading(false);
    }
  }, [isSuccess, isError, data]);


  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || ""); // Chỉ hiển thị email đã xác thực
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAge(user.age || "");
      setAvatar(user.avatar || "");
      setCccd(user.cccd || "");
      setOldPassword(user.password || "");
      setGender(user.gender || "");
    }
  }, [user]);

  const handleOnchangeAvatar = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      await handleUpdateAvatar(file);
    }
  };
const handleUpdateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await UserService.updateUser(user?.id, formData, user?.access_token);
      if (response.status === "OK") {
        toast.success("Thay đổi hình nền thành công");
        setAvatar(response.data.avatar);
      }
    } catch (error) {
      toast.error("Failed to update avatar.");
    }
  };

  const handleUpdate = () => {
    setIsLoading(true);
    const updateData = {};

    if (name !== user.name) updateData.name = name;
    if (username !== user.username) updateData.username = username;
    if (email !== user.email) updateData.email = email;
    if (phone !== user.phone) updateData.phone = phone;
    if (address !== user.address) updateData.address = address;
    if (age !== user.age) updateData.age = age;
    if (cccd !== user.cccd) updateData.cccd = cccd;
    if (gender !== user.gender) updateData.gender = gender;

    mutation.mutate({
      id: user?.id,
      ...updateData,
      access_token: user?.access_token,
    });
    toast.success(" Thay đổi thành công");
    // Xử lý lỗi sau khi mutation thất bại
    if (isError && data?.status === "ERR") {
      toast.error(data?.message || "Update failed");
    }
  };

  const handleUpdatePassword = async (currentPassword, newPassword) => {
    if (!currentPassword) {
      message.error("Current password is required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      message.error("New password and confirm password do not match");
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      message.error("Current password is incorrect");
      return;
    }

    setIsUpdatingPassword(true);
    passwordMutation.mutate({
      id: user?.id,
      currentPassword,
      newPassword,
      access_token: user?.access_token,
    });
  };

  const handleSaveInfoContact = async (updatedContact) => {
    setIsLoadingInfoContact(true); // Bật trạng thái loading
    try {
      console.log("Thông tin liên hệ cần cập nhật:", updatedContact);

      // Cập nhật tạm thời vào state (nếu cần hiển thị trên UI)
      const updatedInfoContacts = infoContact.map((contact) =>
        contact._id === updatedContact._id ? updatedContact : contact
      );
      setInfoContact(updatedInfoContacts);

      console.log("Danh sách thông tin liên hệ sau khi cập nhật:", updatedInfoContacts);
    } catch (error) {
      console.error("Error updating contact:", error);
    } finally {
      setIsLoadingInfoContact(false); // Tắt trạng thái loading
    }
  };




  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview user={user} />;
      case "edit-profile":
        return (
          <ProfileEdit
            user={user}
            onSave={handleUpdate}
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            age={age}
            setAge={setAge}
            cccd={cccd}
            setCccd={setCccd}
            email={email}
            setEmail={setEmail}
            gender={gender}
            setGender={setGender}
            isLoading={isLoading}
          />
        );
      // case "change-password":
      //   return (
      //     <ChangePassword
      //       onChangePassword={handleUpdatePassword}
      //       isUpdatingPassword={isUpdatingPassword}
      //       currentPassword={currentPassword}
      //       setCurrentPassword={setCurrentPassword}
      //       newPassword={newPassword}
      //       setNewPassword={setNewPassword}
      //       confirmNewPassword={confirmNewPassword}
      //       setConfirmNewPassword={setConfirmNewPassword}
      //     />
      //   );
      case "info-account":
        return (
          <InfoAccount
            user={user}
            onChangePassword={handleUpdatePassword}
            isUpdatingPassword={isUpdatingPassword}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmNewPassword={confirmNewPassword}
            setConfirmNewPassword={setConfirmNewPassword}
          />
        );
      case "info-contact":
        return (
          <InfoContact
            userContacts={infoContact}
            userId={userId}
            isLoading={isLoadingInfoContact} // Trạng thái loading
            setIsLoading={setIsLoadingInfoContact} // Hàm cập nhật trạng thái// Truyền trạng thái isLoading
            onSave={handleSaveInfoContact}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-6">
      <div className="shadow-lg rounded-lg overflow-hidden ">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="relative mt-10">
              <img
                src={user.avatar === "" ? "/images/sbcf-default-avatar.webp" : user.avatar}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />

              <input
                type="file"
                className="hidden"
                id="avatar-upload"
                onChange={handleOnchangeAvatar}
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 cursor-pointer bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <BiUpload size={24} />
</label>
            </div>
            <div className="flex items-center space-x-2 mt-2 mb-4">
              <h2 className=" font-semibold mb-2 font-mono text-xl">{name}</h2>
            </div>

            <ul className="flex flex-col space-y-4 pl-0 pb-4">
              <li >
                <button
                  style={{ width: "100%" }}
                  className={`flex items-center space-x-2 ${activeTab === "overview"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                    } py-2 px-4 focus:outline-none transition-colors duration-300`}
                  onClick={() => setActiveTab("overview")}
                >
                  <MdOutlineRemoveRedEye size={20} />
                  <span>Tổng quan</span>
                </button>
              </li>
              <li>
                <button
                  style={{ width: "300px" }}
                  className={`flex items-center space-x-2 ${activeTab === "edit-profile"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                    } py-2 px-4 focus:outline-none transition-colors duration-300`}
                  onClick={() => setActiveTab("edit-profile")}
                >
                  <TbPhotoEdit size={20} />
                  <span>Chỉnh sửa thông tin</span>
                </button>
              </li>
              {/* <li>
                <button
                  style={{ width: "300px" }}
                  className={`flex items-center space-x-2 ${activeTab === "change-password"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                    } py-2 px-4 focus:outline-none transition-colors duration-300`}
                  onClick={() => setActiveTab("change-password")}
                >
                  <TbArrowsExchange size={20} />
                  <span>Thay đổi mật khẩu</span>
                </button>
              </li> */}
              <li>
                <button
                  style={{ width: "300px" }}
                  className={`flex items-center space-x-2 ${activeTab === "info-account"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                    } py-2 px-4 focus:outline-none transition-colors duration-300`}
                  onClick={() => setActiveTab("info-account")}
                >
                  <TbArrowsExchange size={20} />
                  <span>Thông tin đăng nhập</span>
                </button>
              </li>
              <li>
                <button
                  style={{ width: "300px" }}
                  className={`flex items-center space-x-2 ${activeTab === "info-contact"
                    ? "border-b-2 border-blue-500 text-blue-500"
: "text-gray-500 hover:text-blue-500"
                    } py-2 px-4 focus:outline-none transition-colors duration-300`}
                  onClick={() => setActiveTab("info-contact")}
                >
                  <FaHouseUser size={20} />
                  <span>Thông tin liên hệ</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="col-span-2 bg-white">

            <div className="">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;