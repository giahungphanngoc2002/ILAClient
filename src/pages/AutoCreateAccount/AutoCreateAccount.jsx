import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as UserService from "../../services/UserService";
import * as ClassService from "../../services/ClassService";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Layout,
  Row,
  Col,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Content } from "antd/es/layout/layout";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { toast } from "react-toastify";

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
  const [allAccount, setAllAccount] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableScrollHeight, setTableScrollHeight] = useState(300);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const [year, setYear] = useState();
  const [dataClass, setDataClass] = useState([])
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    setYear(`${currentYear}-${nextYear}`);
  }, []);

  console.log(year)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await UserService.getAllAccount();
        const fetchedUserList = data.data.map((account) => account.username);
        setAllAccount(fetchedUserList);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudent();
  }, []);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const data = await ClassService.getAllClassByBlock("6717c5d8ff6baca57f486e9b");
        const filterClassByYear = data.filter((classItem) => classItem.year === year);

        // Chỉ setDataClass nếu có dữ liệu mới
        if (filterClassByYear.length > 0) {
          setDataClass(filterClassByYear);
          console.log("Data set successfully:", filterClassByYear);
        } else {
          console.log("No data available for the specified year.");
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClass();
  }, [year]);


  console.log(dataClass)

  useEffect(() => {
    const calculateTableHeight = () => {
      const screenHeight = window.innerHeight; // Lấy chiều cao màn hình
      const reservedHeight = 350; // Chiều cao dành cho các thành phần khác (header, footer, padding)
      const newHeight = screenHeight - reservedHeight;
      setTableScrollHeight(newHeight > 300 ? newHeight : 300); // Đảm bảo chiều cao tối thiểu
    };

    calculateTableHeight(); // Gọi khi component được mount
    window.addEventListener("resize", calculateTableHeight); // Lắng nghe sự kiện thay đổi kích thước

    return () => window.removeEventListener("resize", calculateTableHeight); // Xóa sự kiện khi component unmount
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
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
    const existingUsernames = new Set(allAccount);

    const generatedAccounts = data.map((row) => {
      const fullName = row["Họ và tên"];
      const birthDate = row["Ngày Sinh"];
      const parentPhone = row["SĐT Phụ Huynh"];
      const parentName = row["Tên Phụ Huynh"];
      const parentCccd = row["CCCD Phụ Huynh"];
      const nameParts = fullName.split(" ");
      const lastName = removeVietnameseTones(nameParts[nameParts.length - 1]).toLowerCase();
      const initials = nameParts
        .slice(0, -1)
        .map((name) => removeVietnameseTones(name[0]).toLowerCase())
        .join("");
      let baseUsername = `${lastName}${initials}`;
      let username = baseUsername;
      let counter = 1;

      while (usernames.has(username) || existingUsernames.has(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      usernames.add(username);

      const password = birthDate ? birthDate.replace(/-/g, "") : "123456";

      return {
        fullName,
        username,
        password,
        parentPhone,
        parentName,
        parentCccd,
      };
    });

    setAccounts(generatedAccounts);
  };

  console.log(accounts)



  const mutation1 = useMutationHooks(
    (data) => UserService.createUserbyRole(data)
  );

  const handleManualAdd = async () => {
    try {
      const values = await form.validateFields();
      await mutation1.mutateAsync({
        name: values.fullName,
        username: values.username,
        password: values.password || "123456",
        confirmPassword: values.password || "123456",
        role: values.role,
      });

      toast.success("Tài khoản được thêm thành công!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Đã xảy ra lỗi: ${error.message}`);
      } else {
        toast.error("Đã xảy ra lỗi khi thêm tài khoản. Vui lòng thử lại.");
      }
    }
  };


  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tài khoản",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "SĐT Phụ huynh",
      dataIndex: "parentPhone",
      key: "parentPhone",
    },
  ];

  const onBack = () => {
    window.history.back();
  };

  const mutation = useMutationHooks(
    (data) => UserService.signupUser(data)
  );



  const exportToExcel = () => {
    if (accounts.length === 0) {
      toast.error("Không có dữ liệu để xuất!");
      return;
    }

    const formattedData = accounts.map((account) => {
      const baseData = {
        "Họ và tên": account.fullName,
        "Tài khoản": account.username,
      };

      dataClass.forEach((classItem) => {
        baseData[classItem.nameClass] = null;
      });

      return baseData;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách tài khoản");

    // Ghi file Excel
    XLSX.writeFile(workbook, "Danh_sach_tai_khoan.xlsx");
    toast.success("Xuất file Excel thành công!");
  };


  const handleAutoCreateAccount = () => {
    try {
      // Lấy danh sách lớp theo khối


      exportToExcel();

      // Lặp qua từng account để tạo tài khoản
      accounts.forEach((account) => {
        // Mutation cho người dùng
        mutation.mutate({
          username: account.username,
          password: account.password,
          confirmPassword: account.password,
          name: account.fullName,
          cccd: account.parentCccd,
          phoneParent: account.parentPhone,
          nameParent: account.parentName,
        });

        // Mutation cho phụ huynh
        mutation1.mutate({
          name: account.parentName,
          username: account.parentPhone,
          password: "123456",
          confirmPassword: "123456",
          role: "Parent",
        });
      });

      // Hiển thị toast khi tất cả các tài khoản đã được xử lý
      toast.success("Tất cả tài khoản đã được tạo thành công!");
      console.log("Tất cả tài khoản đã được tạo thành công!");
    } catch (error) {
      // Xử lý lỗi nếu có lỗi xảy ra
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
      console.error("Đã xảy ra lỗi:", error.message);
    }
  };




  return (
    <Layout style={{ height: "100vh" }}>
      <Breadcrumb
        title="Tạo tài khoản tự động"
        onBack={onBack}
        buttonText="Hoàn thành"
        onButtonClick={handleAutoCreateAccount}
      />

      <div className="pt-16"></div>
      <Content
        style={{
          margin: "20px",
          background: "#fff",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          <Col xs={24} sm={12} md={8}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              style={{
                padding: "10px",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                width: "100%",
              }}
            />
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}

              style={{ width: "100%", height: "100%", fontSize: "16px" }}
            >
              Tạo tài khoản
            </Button>
          </Col>
        </Row>
        <Table
          dataSource={accounts}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={{
            pageSize,
            position: ["bottomCenter"], // Giữ phân trang ở dưới cùng
          }}
          bordered
          scroll={{
            x: "max-content",
            y: tableScrollHeight, // Đặt chiều cao cuộn
          }}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </Content>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleManualAdd}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Tài khoản"
            rules={[
              { required: true, message: "Vui lòng nhập tài khoản!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !allAccount.includes(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Tài khoản đã tồn tại, vui lòng nhập tài khoản khác!")
                  );
                },
              }),
            ]}
          >
            <Input placeholder="Nhập tài khoản" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu">
            <Input.Password placeholder="Nhập mật khẩu (mặc định: 123456)" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value="Teacher">Giáo viên</Select.Option>
              <Select.Option value="User">Học sinh</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>


    </Layout>
  );


};

export default AutoCreateAccount;