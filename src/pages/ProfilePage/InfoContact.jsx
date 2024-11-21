import React, { useEffect, useState } from "react";
import { RxUpdate } from "react-icons/rx";
import * as UserService from "../../services/UserService";
import { toast } from "react-toastify";

const InfoContact = ({ userId }) => {
    const [userContacts, setUserContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [cccd, setCccd] = useState("");
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch danh sách liên hệ từ API
    const fetchUserContacts = async () => {
        try {
            const response = await UserService.getInfoContactByUserId(userId);
            console.log(response); // Kiểm tra phản hồi từ API
            setUserContacts(response); // Cập nhật danh sách liên hệ
        } catch (error) {
            console.error("Failed to fetch contacts:", error.message);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserContacts(); // Gọi API khi userId có giá trị
        }
    }, [userId]);

    // Cập nhật form khi người dùng chọn liên hệ khác
    useEffect(() => {
        if (userContacts && userContacts[selectedContact]) {
            const user = userContacts[selectedContact];
            setName(user.name || "");
            setPhone(user.phone || "");
            setEmail(user.email || "");
            setCccd(user.cccd || "");
            setAddress(user.address || "");
        }
    }, [userContacts, selectedContact]);

    const handleSave = async () => {
        try {
            setIsLoading(true); // Bật trạng thái loading trước khi thực hiện thao tác

            const contactData = {
                name,
                email,
                phone,
                cccd,
                address,
            };

            let response;

            if (userContacts[selectedContact]?._id) {
                // Cập nhật liên hệ
                const contactId = userContacts[selectedContact]._id;
                response = await UserService.updateContact(contactId, contactData);
                toast.success("Update contact success");
                console.log("Updated contact:", response);
            } else {
                // Thêm mới liên hệ
                response = await UserService.createContact(userId, contactData);
                toast.success("Created new contact success");
                console.log("Created new contact:", response);
            }

            // Reload lại danh sách liên hệ sau khi lưu
            await fetchUserContacts();
        } catch (error) {
            console.error("Error saving contact:", error);
            toast.error("Failed to save contact");
        } finally {
            setIsLoading(false); // Tắt trạng thái loading sau khi hoàn thành
        }
    };

    return (
        <div className="p-6">
            <h5 className="text-2xl font-semibold mb-6 text-center">Thông tin liên hệ</h5>

            {/* Contact Selector */}
            <div className="flex justify-center mb-4">
                {userContacts &&
                    userContacts.map((contact, index) => (
                        <button
                            key={contact._id}
                            onClick={() => setSelectedContact(index)}
                            className={`px-4 py-2 border rounded-lg mx-2 ${
                                selectedContact === index
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            {contact.name}
                        </button>
                    ))}
            </div>

            <div className="space-y-6 max-w-lg mx-auto">
                {/* Name */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="w-full font-medium">Họ và tên</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                {/* Phone */}
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

                {/* CCCD */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="w-full font-medium">Căn cước công dân</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cccd}
                        onChange={(e) => setCccd(e.target.value)}
                    />
                </div>
                {/* Address */}
                <div className="flex flex-col items-start space-y-2">
                    <label className="w-full font-medium">Địa chỉ</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                {/* Update Button */}
                <div className="flex justify-center">
                    <button
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={handleSave}
                        disabled={isLoading} // Disable button nếu đang loading
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
