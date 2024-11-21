import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as UserService from "../../services/UserService";


// Hàm loại bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const AutoCreateAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [fileName, setFileName] = useState("");
  const [allAccount, setAllAccount] = useState();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await UserService.getAllUser();

  
        // Tính toán userList ngay sau khi dữ liệu được lấy
        const fetchedUserList = data.data.map((account) => account.username);
        setAllAccount(fetchedUserList); // Lưu vào state nếu bạn cần
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
  
    fetchStudent();
  }, []);

  console.log(allAccount);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        generateAccounts(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const generateAccounts = (data) => {
    const usernames = new Set();
    const existingUsernames = new Set(allAccount); // Chuyển userList thành Set để kiểm tra nhanh hơn
  
    const generatedAccounts = data.map((row) => {
      const fullName = row["Họ và tên"]; // Cột tên trong file Excel
      const birthDate = row["Ngày Sinh"]; // Cột ngày sinh trong file Excel
      const nameParts = fullName.split(" ");
      const lastName = removeVietnameseTones(nameParts[nameParts.length - 1]).toLowerCase();
      const initials = nameParts
        .slice(0, -1)
        .map((name) => removeVietnameseTones(name[0]).toLowerCase())
        .join("");
      let baseUsername = `${lastName}${initials}`;
      let username = baseUsername;
      let counter = 1;
  
      // Kiểm tra trong cả usernames và existingUsernames
      while (usernames.has(username) || existingUsernames.has(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
  
      usernames.add(username); // Thêm username mới vào tập usernames
  
      // Xử lý ngày sinh làm mật khẩu (loại bỏ dấu '-')
      const password = birthDate ? birthDate.replace(/-/g, "") : "123456";
  
      return {
        fullName,
        username,
        password, // Mật khẩu được đặt theo ngày sinh
      };
    });
  
    setAccounts(generatedAccounts);
  };
  


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-5">Tạo Tài Khoản Tự Động</h1>

      {/* Input File */}
      <input
        type="file"
        accept=".xlsx, .xls"
        className="mb-5 px-4 py-2 border rounded-lg shadow-sm"
        onChange={handleFileUpload}
      />

      {/* Hiển thị danh sách tài khoản */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">Danh sách tài khoản</h2>
        {accounts.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">Họ và tên</th>
                <th className="border border-gray-300 px-4 py-2">Tài khoản</th>
                <th className="border border-gray-300 px-4 py-2">Mật khẩu</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{account.fullName}</td>
                  <td className="border border-gray-300 px-4 py-2">{account.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{account.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Chưa có tài khoản nào được tạo.</p>
        )}
      </div>
    </div>
  );
};

export default AutoCreateAccount;
