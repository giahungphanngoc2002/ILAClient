import React, { useEffect } from "react";
import { RxUpdate } from "react-icons/rx";

const InfoContact = ({
    user,
    onSave,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    role,
    setRole,
    cccd,
    setCccd,
    address,
    setAddress,
    isLoading,
}) => {
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhone(user.phone || "");
            setEmail(user.email || "");
            setRole(user.role || "Ba"); // Mặc định là "Ba" nếu không có role
            setCccd(user.cccd || "");
            setAddress(user.address || "");
        }
    }, [user, setName, setPhone, setEmail, setRole, setCccd, setAddress]);

    return (
        <div className="p-6">
            <h5 className="text-2xl font-semibold mb-6 text-center">Thông tin liên hệ</h5>
            <div className="space-y-6 max-w-lg mx-auto">
                {/* Tên */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="w-full font-medium">Họ và tên</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                {/* Số điện thoại */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="w-full font-medium">Số điện thoại</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                {/* Email */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="w-full font-medium">Email</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {/* Role */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="w-full font-medium">Vai trò</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="Ba">Ba</option>
                        <option value="Mẹ">Mẹ</option>
                    </select>
                </div>
                {/* CCCD */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="w-full font-medium">Căn cước công dân</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cccd}
                        onChange={(e) => setCccd(e.target.value)}
                    />
                </div>
                {/* Địa chỉ */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="w-full font-medium">Địa chỉ</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                {/* Nút cập nhật */}
                <div className="flex justify-center">
                    <button
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={onSave}
                        disabled={isLoading}
                    >
                        <RxUpdate className="text-xl" />
                        <span>{isLoading ? "Updating..." : "Update"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoContact;
