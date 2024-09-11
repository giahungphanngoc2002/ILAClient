import React from 'react';
import { AccountManage } from '../AccountManage/AccountManage';

const UserManage = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-12 pt-4">
                <div className="col-span-full h-full  overflow-y-auto">
                    <AccountManage />
                </div>
            </div>
        </div>
    );
};

export default UserManage;
