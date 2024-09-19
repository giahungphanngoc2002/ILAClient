import React from 'react';
import { TopBar } from '../../components/TopBar/TopBar';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import Dashboard from './Dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom';
import UserManage from './UserManage/UserManage';
import { ClassManage } from './ClassManage/ClassManage';
import { PayOsHistoryManage } from './PayOsHistory/PayOsHistoryManage';

const Admin = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-gray-100">
                <TopBar />
                <div className="flex-1 p-8 overflow-y-auto">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="user" element={<UserManage />} />
                        <Route path="class" element={<ClassManage />} />
                        <Route path="revenue" element={<PayOsHistoryManage />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Admin;
