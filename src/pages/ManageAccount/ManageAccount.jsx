import React, { useState, useEffect, useMemo } from "react";
import {
    Table,
    Button,
    Input,
    Select,
    Layout,
    Row,
    Col,
    Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const { Search } = Input;
const { Option } = Select;
const { Content } = Layout;

const ManageAccount = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [tableScrollHeight, setTableScrollHeight] = useState(300);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setIsLoading(true); // Bật trạng thái loading
                const data = await UserService.getAllAccount();
                const sanitizedData = data.data.map(student => ({
                    ...student,
                    name: student.name || "Unknown", // Thêm giá trị mặc định nếu thiếu
                    role: student.role || "User"     // Đảm bảo trường role không bị undefined
                }));
                setStudents(sanitizedData);
            } catch (error) {
                console.error("Error fetching student data:", error);
            } finally {
                setIsLoading(false); // Tắt trạng thái loading
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        const calculateTableHeight = () => {
            const screenHeight = window.innerHeight; // Chiều cao màn hình
            const reservedHeight = 350; // Chiều cao dành cho các thành phần khác
            const newHeight = screenHeight - reservedHeight;
            setTableScrollHeight(newHeight > 300 ? newHeight : 300); // Đảm bảo chiều cao tối thiểu
        };

        calculateTableHeight(); // Gọi khi component được mount
        window.addEventListener("resize", calculateTableHeight); // Lắng nghe sự kiện thay đổi kích thước

        return () => window.removeEventListener("resize", calculateTableHeight); // Xóa sự kiện khi unmount
    }, []);

    const handleEdit = (record) => {
        console.log("Edit student:", record);
    };

    // Dữ liệu đã được lọc
    const filteredData = useMemo(() => {
        return students.filter((student) => {
            const name = student.name || ""; // Xử lý giá trị undefined
            const matchesSearchTerm = name
                .toLowerCase()
                .includes((searchTerm || "").toLowerCase()); // Xử lý undefined
            const matchesRole = filterRole
                ? student.role === filterRole
                : true;
            return matchesSearchTerm && matchesRole;
        });
    }, [students, searchTerm, filterRole]);

    const columns = [
        {
            title: "Họ và tên",
            dataIndex: "name",
            key: "name",
            render: (name) => name || "Unknown", // Hiển thị "Unknown" nếu name bị thiếu
            sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
        },
        {
            title: "Tài khoản",
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => (a.username || "").localeCompare(b.username || ""),
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            sorter: (a, b) => (a.role || "").localeCompare(b.role || ""),
        },
        {
            title: "Hành Động",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                </Space>
            ),
        },
    ];

    const onBack = () => {
        window.history.back();
    };

    return (
        <Layout style={{ height: "100vh" }}>
            <Breadcrumb title="Quản lí người dùng" onBack={onBack} displayButton={false} />
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
                        <Search
                            placeholder="Tìm theo tên"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                        <Select
                            placeholder="Chọn vai trò"
                            style={{ width: "100%" }}
                            onChange={(value) => setFilterRole(value)}
                            allowClear
                        >
                            <Option value="Teacher">Teacher</Option>
                            <Option value="User">User</Option>
                        </Select>
                    </Col>
                </Row>
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        position: ["bottomCenter"],
                    }}
                    bordered
                    scroll={{
                        x: "max-content",
                        y: tableScrollHeight,
                    }}
                    style={{ width: "100%", borderRadius: "8px" }}
                    loading={isLoading}
                />
            </Content>
        </Layout>
    );
};

export default ManageAccount;
