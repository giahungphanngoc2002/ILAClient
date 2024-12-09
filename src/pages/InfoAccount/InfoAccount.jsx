import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import ChangePassword from "../ChangePassWord/ChangePassWord"; // Import component đổi mật khẩu

const InfoAccount = ({
    user,
    onChangePassword,
    isUpdatingPassword,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
}) => {
    const [email, setEmail] = useState("");
    const [showModalEmail, setShowModalEmail] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleCloseModalEmail = () => setShowModalEmail(false);
    const handleShowModalEmail = () => setShowModalEmail(true);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = () => {
        alert(`Email submitted: ${email}`);
        handleCloseModalEmail();
    };

    const hideChangePassword = () => {
        setShowChangePassword(false);
    }

    return (
        <div className="p-6">
            <h5 className="text-2xl font-semibold mb-6 text-center">Thông tin tài khoản</h5>
            <div className="grid grid-cols-3 gap-4 mx-auto">
                {/* Tên đăng nhập */}
                <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">Tên đăng nhập:</div>
                <div className="border-b py-2 col-span-2">
                    <p className="m-0">{user.username || "No name provided"}</p>
                </div>

                {/* Email */}
                <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">Email:</div>
                <div className="border-b py-2 col-span-2 flex items-center justify-between">
                    <p className="m-0">{user.email || "(Chưa có thông tin)"}</p>
                    <button onClick={handleShowModalEmail} className="ml-4 text-blue-500 hover:underline">Cập nhật</button>
                </div>

                {/* Số điện thoại */}
                <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">Số điện thoại:</div>
                <div className="border-b py-2 col-span-2 flex items-center justify-between">
                    <p className="m-0">{user.phone || "(Chưa có thông tin)"}</p>
                    <button onClick={() => setShowChangePassword(true)} className="ml-4 text-blue-500 hover:underline">Cập nhật</button>
                </div>

                {/* Mật khẩu */}
                {!showChangePassword && (
                    <>

                        <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">Mật khẩu:</div>
                        <div className="border-b py-2 col-span-2 flex items-center justify-between">
                            <p className="m-0">********</p>
                            <button
className="ml-4 text-blue-500 hover:underline"
                                onClick={() => setShowChangePassword(true)} // Thêm sự kiện khi nhấn đổi mật khẩu
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Hiển thị phần đổi mật khẩu */}
            {showChangePassword && (
                <div
                    style={{ backgroundColor: "#F8F8F8" }}
                    className="flex space-x-4 grid grid-cols-3  mx-auto p-6">
                    {/* Chiếm 1/3 width */}
                    <div className="col-span-1 border-r font-bold">
                        Mật khẩu
                    </div>

                    {/* Chiếm 2/3 width */}
                    <div className="col-span-2">
                        <ChangePassword
                            onChangePassword={onChangePassword}
                            isUpdatingPassword={isUpdatingPassword}
                            currentPassword={currentPassword}
                            setCurrentPassword={setCurrentPassword}
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            confirmNewPassword={confirmNewPassword}
                            setConfirmNewPassword={setConfirmNewPassword}
                            hideChangePassword={hideChangePassword}
                        />
                    </div>
                </div>

            )}

            <Modal show={showModalEmail} onHide={handleCloseModalEmail}>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEmail">
                            <h5>Email đăng nhập:</h5>
                            <p>
                                Vui lòng nhập địa chỉ email để xác thực
                            </p>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalEmail}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Gửi email xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default InfoAccount;