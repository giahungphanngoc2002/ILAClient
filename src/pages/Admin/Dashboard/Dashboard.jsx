import React, { useEffect, useState } from 'react';
import Card from '../../../components/Card/Card';
import { FaRegUser, FaHouseUser, FaMoneyBill, FaCommentDots } from 'react-icons/fa';
import { AccountManage } from '../AccountManage/AccountManage';
import * as UserService from "../../../services/UserService";
import * as ClassService from "../../../services/ClassService";
const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [classCount, setCLassCount] = useState(0);
    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const data = await UserService.getcountUsers(); // Gọi hàm API lấy dữ liệu
                setUserCount(data.count); // Cập nhật state với dữ liệu từ API
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };
        
        fetchUserCount(); // Gọi hàm khi component được mount
    }, []); // [] đảm bảo rằng API chỉ được gọi một lần khi component được render

    useEffect(() => {
        const fetchClassCount = async () => {
            try {
                const data = await ClassService.getCountClass(); // Gọi hàm API lấy dữ liệu
                setCLassCount(data.count); // Cập nhật state với dữ liệu từ API
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };
        
        fetchClassCount(); // Gọi hàm khi component được mount
    }, []); // [] đảm bảo rằng API chỉ được gọi một lần khi component được render
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card
                    icon={<FaRegUser />}
                    title="Số lượng thành viên"
                    value={userCount}
                    color="blue"
                />
                <Card
                    icon={<FaHouseUser />}
                    title="Số lượng lớp"
                    value={classCount}
                    color="red"
                />
                <Card
                    icon={<FaMoneyBill />}
                    title="Doanh thu"
                    value="1.000.000 đ"
                    color="green"
                />
                <Card
                    icon={<FaCommentDots />}
                    title="Đánh giá"
                    value="25"
                    color="yellow"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-12 pt-4">
                <div className="col-span-full h-full  overflow-y-auto">
                    <AccountManage />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
