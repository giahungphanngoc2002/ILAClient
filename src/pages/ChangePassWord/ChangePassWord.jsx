import React, { useState } from "react";
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { RxUpdate } from "react-icons/rx";
import { toast } from "react-toastify";

const ChangePassword = ({
  onChangePassword,
  isUpdatingPassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  hideChangePassword,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [error, setError] = useState("");

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      toast.error("Current password is required");
    } else if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match");
    } else {
      setError("");
      onChangePassword(currentPassword, newPassword);
    }
  };

  return (
    <div className="">
      <h5 className="text-2xl font-semibold mb-6 text-center">
        Change Password
      </h5>
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="flex flex-col items-start space-y-2">
          <div className="flex w-full">
            <label className="w-1/3 font-medium">Current Password</label>
            <div className="relative w-2/3">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
        </div>


        <div className="flex flex-col items-start space-y-2">
          <div className="flex w-full">
            <label className="w-1/3 font-medium">New Password</label>
            <div className="relative w-2/3">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start space-y-2">
          <div className="flex w-full">
            <label className="w-1/3 font-medium">Confirm New Password</label>
            <div className="relative w-2/3">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              >
                {showConfirmNewPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end">
          <button
            className="mr-4 flex items-center space-x-2 px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleUpdatePassword}
            disabled={isUpdatingPassword}
          >
            <span style={{ fontSize: "13px" }}>
              {isUpdatingPassword ? "Updating..." : "Cập nhập"}
            </span>
          </button>
          <button
            className="flex items-center space-x-2 px-2 py-1 bg-gray-500 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={hideChangePassword}
          >
            <span style={{ fontSize: "13px" }}>
              Bỏ qua
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;