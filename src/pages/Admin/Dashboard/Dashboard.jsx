import React from 'react';
import Card from '../../../components/Card/Card';
import { FaRegUser, FaHouseUser, FaMoneyBill, FaCommentDots } from 'react-icons/fa';
import { AccountManage } from '../AccountManage/AccountManage';

const Dashboard = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card
                    icon={<FaRegUser />}
                    title="Số lượng thành viên"
                    value="100"
                    color="blue"
                />
                <Card
                    icon={<FaHouseUser />}
                    title="Số lượng lớp"
                    value="30"
                    color="red"
                />
                <Card
                    icon={<FaMoneyBill />}
                    title="Doanh thu"
                    value="1.000.000 đ"
                    color="purple"
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
