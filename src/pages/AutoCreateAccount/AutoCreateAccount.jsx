import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as UserService from "../../services/UserService";
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

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await UserService.getAllUser();
        const fetchedUserList = data.data.map((account) => account.username);
        setAllAccount(fetchedUserList);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudent();
  }, []);

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
      };
    });

    setAccounts(generatedAccounts);
  };

  const handleManualAdd = () => {
    form.validateFields().then((values) => {
      const newAccount = {
        fullName: values.fullName,
        username: values.username,
        password: values.password || "123456",
        role:values.role,
      };
      console.log(newAccount)
      // message.success("Tài khoản được thêm thành công!");
    });
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
  ];

  const onBack = () => {
    window.history.back();
  };

  const mutation = useMutationHooks(
    (data) => UserService.signupUser(data)
  );

  const handleAutoCreateAccount = async () => {
    console.log(accounts);

    try {
      // Sử dụng Promise.all để thực hiện tất cả các mutation song song
      await Promise.all(
        accounts.map((account) =>
          mutation.mutateAsync({
            username: account.username,
            password: account.password,
            confirmPassword: account.password,
          })
        )
      );

      // Khi tất cả các tài khoản được tạo xong, hiển thị toast thành công
      toast.success('Tất cả tài khoản đã được tạo thành công!');
      console.log('Tất cả tài khoản đã được tạo thành công!');
    } catch (error) {
      // Xử lý lỗi khi bất kỳ tài khoản nào thất bại
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
      console.error('Đã xảy ra lỗi:', error.message);
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
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
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
              <Select.Option value="User">Giáo viên</Select.Option>
              <Select.Option value="Teacher">Học sinh</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>


    </Layout>
  );


};

export default AutoCreateAccount;
