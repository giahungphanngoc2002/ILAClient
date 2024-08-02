import React, { useEffect } from "react";
import { RxUpdate } from "react-icons/rx";

const ProfileEdit = ({
  user,
  onSave,
  name,
  setName,
  email,
  phone,
  setPhone,
  address,
  setAddress,
  age,
  setAge,
  isLoading,
}) => {
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAge(user.age || "");
    }
  }, [user, setName, setPhone, setAddress, setAge]);
  const formattedAge = age ? age.split("T")[0] : "";

  return (
    <div className="p-6">
      <h5 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h5>
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="flex flex-col items-start space-y-2">
          <label className="w-full font-medium">Name</label>
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start space-y-2">
          <label className="w-full font-medium">Email</label>
          <input
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            value={email}
            disabled
          />
        </div>
        <div className="flex flex-col items-start space-y-2">
          <label className="w-full font-medium">Phone</label>
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start space-y-2">
          <label className="w-full font-medium">Address</label>
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start space-y-2">
          <label className="w-full font-medium">Age</label>
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formattedAge}
            type="date"
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        {/* <div className="col-span-1 mb-3">
                          <h6>Age</h6>
                          <input
                            type="date"
                            value={formattedAge}
                            onChange={handleOnchangeAge}
                            className="w-full p-2 border rounded"
                          />
                        </div> */}
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

export default ProfileEdit;