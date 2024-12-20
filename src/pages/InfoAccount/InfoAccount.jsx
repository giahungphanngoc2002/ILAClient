

import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import ChangePassword from "../ChangePassWord/ChangePassWord"; // Import component đổi mật khẩu
import { updateUser } from "../../redux/slices/userSlide";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

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
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    // Handle email modal open/close
    const handleCloseModalEmail = () => setShowModalEmail(false);
    const handleShowModalEmail = () => setShowModalEmail(true);


    const { email: updatedEmail } = useSelector((state) => state.user); // Lấy email từ store

    useEffect(() => {
        if (updatedEmail) {
            setEmail(updatedEmail); // Cập nhật lại email nếu có thay đổi từ Redux
        }
    }, [updatedEmail]);
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    // Mutation for updating user


    // Handle email update submission
    const handleSubmit = () => {
        const updateData = {};
        if (email !== user.email) updateData.email = email;
        setIsLoading(true);
        mutate({
            id: user?.id,
            ...updateData,
            access_token: user?.access_token,
        });
    };

    // Lưu thông tin người dùng và gọi API
    const { mutate, isSuccess, isError, data, error } = useMutationHooks((data) => {
        const { id, access_token, ...rests } = data;
        return UserService.updateUser(id, rests, access_token);
    });

    // Handle success/error mutation result
    useEffect(() => {
        if (isSuccess) {
            if (data?.status === "OK") {
                toast.success("Email cập nhập thành công!");
                dispatch(updateUser({ email })); // Cập nhật lại email trong store
            } else {
                toast.error(data?.message || "lỗi khi xảy xa cập nhập");
            }
            setIsLoading(false);  // Đặt lại isLoading khi API trả về thành công
        } else if (isError) {
            toast.error(error?.message || "Đã xảy ra lỗi ko xác định");
            setIsLoading(false); // Đặt lại isLoading khi có lỗi
        }
    }, [isSuccess, isError, data, error, email, dispatch]);


    // Hide change password component
    const hideChangePassword = () => {
        setShowChangePassword(false);
    };

    return (
        <div className="p-6">
            <h5 className="text-2xl font-semibold mb-6 text-center">Thông tin tài khoản</h5>
            <div className="grid grid-cols-3 gap-4 mx-auto">
                {/* Username */}
                <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">
                    Tên đăng nhập:
                </div>
                <div className="border-b py-2 col-span-2">
                    <p className="m-0">{user.username || "No name provided"}</p>
                </div>

                {/* Email */}
                <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">
                    Email:
                </div>
                <div className="border-b py-2 col-span-2 flex items-center justify-between">
                    <p className="m-0">{user.email || "(Chưa có thông tin)"}</p>
                    <button
                        onClick={handleShowModalEmail}
                        className="ml-4 text-blue-500 hover:underline"
                    >
                        Cập nhật
                    </button>
                </div>

                {/* Phone */}
                <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">
                    Số điện thoại:
                </div>
                <div className="border-b py-2 col-span-2 flex items-center justify-between">
                    <p className="m-0">{user.phone || "(Chưa có thông tin)"}</p>
                    <button
                        onClick={() => setShowChangePassword(true)}
                        className="ml-4 text-blue-500 hover:underline"
                    >
                        Cập nhật
                    </button>
                </div>

                {/* Password */}
                {!showChangePassword && (
                    <>
                        <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">
                            Mật khẩu:
                        </div>
                        <div className="border-b py-2 col-span-2 flex items-center justify-between">
                            <p className="m-0">********</p>
                            <button
                                className="ml-4 text-blue-500 hover:underline"
                                onClick={() => setShowChangePassword(true)}
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Change password */}
            {showChangePassword && (
                <div
                    style={{ backgroundColor: "#F8F8F8" }}
                    className="flex space-x-4 grid grid-cols-3  mx-auto p-6"
                >
                    <div className="col-span-1 border-r font-bold">Mật khẩu</div>
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

            {/* Email Modal */}
            <Modal show={showModalEmail} onHide={handleCloseModalEmail}>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEmail">
                            <h5>Email đăng nhập:</h5>
                            <p>Vui lòng nhập địa chỉ email để xác thực</p>
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
                    <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? <Spinner as="span" animation="border" size="sm" /> : "Gửi email xác nhận"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InfoAccount;
