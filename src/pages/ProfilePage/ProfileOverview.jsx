import React from "react";

const ProfileOverview = ({ user }) => {
  return (
    <div className="bg-gray-100 p-6 border rounded-lg shadow-lg">
      <h5 className="text-xl font-semibold mb-4">About</h5>
      <p className="text-sm italic mb-6 border-b pb-4">
        Passionate about leveraging technology to solve real-world problems, our
        team is committed to creating innovative solutions that drive efficiency
        and improve user experiences. With a strong emphasis on collaboration
        and continuous improvement, we strive to exceed expectations and deliver
        exceptional value to our clients and stakeholders.
      </p>

      <h5 className="text-xl font-semibold mb-4 ">Profile Details</h5>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-gray-600 border-b py-2 font-semibold font-mono">
          Full Name:
        </div>
        <div className="border-b py-2">{user.name}</div>
        <div className="text-gray-600 border-b py-2 font-semibold font-mono">
          Email:
        </div>
        <div className="border-b py-2">{user.email}</div>
        <div className="text-gray-600 border-b py-2 font-semibold font-mono">
          Phone:
        </div>
        <div className="border-b py-2">{user.phone}</div>
        <div className="text-gray-600 border-b py-2 font-semibold font-mono ">
          Address:
        </div>
        <div className="border-b py-2">{user.address}</div>
        <div className="text-gray-600 border-b py-2 font-semibold font-mono">
          Age:
        </div>
        <div className="border-b py-2">{new Date(user.age).toLocaleDateString()}</div>
        
      </div>
    </div>
  );
};

export default ProfileOverview;