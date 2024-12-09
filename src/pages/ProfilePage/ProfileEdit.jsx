import React, { useEffect, useState } from "react";
import { RxUpdate } from "react-icons/rx";
import { provinces, getDistricts, getWards } from "vietnam-provinces";

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
  cccd,
  setCccd,
  setEmail,
  gender,
  setGender,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAge(user.age || "");
      setCccd(user.cccd || "");
      setGender(user.gender || "")
    }
  }, [user, setName, setPhone, setAddress, setAge, setEmail, setGender]);

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    const districtList = getDistricts(provinceCode);
    setDistricts(districtList);
    setSelectedDistrict(""); // Reset selected district when province changes
    setSelectedWard(""); // Clear ward when province changes
    setWards([]); // Clear wards when province changes

    // Lấy tên tỉnh từ mã
    const province = provinces.find(p => p.code === provinceCode);
    const provinceName = province ? province.name : "Chưa chọn tỉnh";

    // In ra tên địa chỉ
    const addressString = `${provinceName} , Chưa chọn quận , Chưa chọn phường`;
    console.log('Địa chỉ hiện tại:', addressString);
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    const wardList = getWards(districtCode);
    setWards(wardList);
    setSelectedWard(""); // Clear selected ward when district changes

    // Lấy tên quận từ mã
    const district = districts.find(d => d.code === districtCode);
    const districtName = district ? district.name : "Chưa chọn quận";

    // In ra tên địa chỉ
    const province = provinces.find(p => p.code === selectedProvince);
    const provinceName = province ? province.name : "Chưa chọn tỉnh";

    const addressString = `${provinceName} , ${districtName} , Chưa chọn phường`;
    console.log('Địa chỉ hiện tại:', addressString);
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    setSelectedWard(wardCode);

    // Lấy tên phường từ mã
    const ward = wards.find(w => w.code === wardCode);
    const wardName = ward ? ward.name : "Chưa chọn phường";

    // In ra tên địa chỉ
    const province = provinces.find(p => p.code === selectedProvince);
    const provinceName = province ? province.name : "Chưa chọn tỉnh";

    const district = districts.find(d => d.code === selectedDistrict);
    const districtName = district ? district.name : "Chưa chọn quận";

    const addressString = `${provinceName} , ${districtName} , ${wardName}`;
    // console.log('Địa chỉ hiện tại:', addressString);
    setFullAddress(addressString)
  };

  const formattedAge = age ? age.split("T")[0] : "";

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-6">
      <h5 className="text-2xl font-semibold mb-6 text-center">Chỉnh sửa thông tin</h5>
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {/* Họ và tên */}
        <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">Họ và tên:</div>
        <div className="border-b py-2 col-span-2">
          {isEditing ? (
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p>{name || "No name provided"}</p>
          )}
        </div>

        {/* Giới tính */}
        <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">Giới tính:</div>
        <div className="border-b py-2 col-span-2">
          {isEditing ? (
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={gender === "Nam"}
                  onChange={(e) => setGender(e.target.value)}
                  className="mr-2"
                />
                Nam
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={gender === "Nữ"}
                  onChange={(e) => setGender(e.target.value)}
                  className="mr-2"
                />
                Nữ
              </label>
            </div>
          ) : (
            <p>{gender || "Chưa chọn giới tính"}</p>
          )}
        </div>

        {/* Địa chỉ (province, district, ward) */}
        <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">Địa chỉ:</div>
        <div className="border-b py-2 col-span-2">
          {isEditing ? (
            <div>
              <select
                className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleProvinceChange}
                value={selectedProvince}
              >
                <option value="">-- Chọn tỉnh thành --</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>

              {selectedProvince && (
                <>
                  <select
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleDistrictChange}
                    value={selectedDistrict}
                  >
                    <option value="">-- Chọn quận huyện --</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>

                  {selectedDistrict && (
                    <select
                      className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleWardChange}
                      value={selectedWard}
                    >
                      <option value="">-- Chọn phường xã --</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              )}
            </div>
          ) : (
            <p>{fullAddress || "No address provided"}</p>
          )}
        </div>

        {/* Ngày sinh */}
        <div className="text-gray-600 border-b py-2 font-semibold font-mono col-span-1">Ngày sinh:</div>
        <div className="border-b py-2 col-span-2">
          {isEditing ? (
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formattedAge}
              type="date"
              onChange={(e) => setAge(e.target.value)}
            />
          ) : (
            <p>{formattedAge || "No date of birth provided"}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => {
            toggleEdit(); // Toggle chế độ chỉnh sửa
            if (isEditing) {
              const updatedUserInfo = {
                name,
                email,
                phone,
                address: fullAddress,
                age,
                cccd,
                gender,
              };
              onSave(updatedUserInfo); // Gọi onSave khi lưu thông tin
            }
          }}
        >
          <RxUpdate className="mr-2" />
          {isEditing ? "Lưu thông tin" : "Chỉnh sửa"}
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;