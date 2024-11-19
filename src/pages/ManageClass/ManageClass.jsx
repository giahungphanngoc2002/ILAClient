import React, { useState, useEffect } from "react";
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
    Space,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as ClassService from "../../services/ClassService";
import * as BlockService from "../../services/BlockService";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";


const { Search } = Input;
const { Option } = Select;
const { Content } = Layout;

const App = () => {
    const [classes, setClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("");
    const [formData, setFormData] = useState({ _id: null, name: "", class: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10); // Số dòng hiển thị mỗi trang
    const [tableScrollHeight, setTableScrollHeight] = useState(300); // Chiều cao mặc định

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await ClassService.getAllClass(); // Thay thế bằng API thực tế
                if (data && data.data && Array.isArray(data.data)) {
                    setClasses(data.data); // Gán dữ liệu nếu hợp lệ
                } else {
                    console.error("Invalid data format:", data);
                }
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            }
        };

        fetchSchedule();
    }, []);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await BlockService.getAllBlocks(); // Thay thế bằng API thực tế
                // if (data && data.data && Array.isArray(data.data)) {
                //     setClasses(data.data); // Gán dữ liệu nếu hợp lệ
                // } else {
                //     console.error("Invalid data format:", data);
                // }

                console.log(data)
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            }
        };

        fetchSchedule();
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

    // Lọc và chuẩn hóa dữ liệu học sinh từ JSON
    const filteredStudents = classes.flatMap((cls) =>
        cls.studentID.map((student) => ({
            name: student.name, // Tên học sinh
            class: cls.nameClass, // Lớp học
            _id: student._id, // ID của học sinh
        }))
    ).filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filterClass || student.class === filterClass)
    );

    const handleAddOrEdit = () => {
        const { _id, name, class: className } = formData;

        setClasses((prev) => {
            const updatedClasses = [...prev];
            const classIndex = updatedClasses.findIndex((cls) => cls.nameClass === className);

            if (_id) {
                updatedClasses[classIndex].studentID = updatedClasses[classIndex].studentID.map(
                    (student) => (student._id === _id ? { ...student, name } : student)
                );
            } else {
                updatedClasses[classIndex].studentID.push({
                    _id: Date.now().toString(),
                    name,
                });
            }

            return updatedClasses;
        });

        setFormData({ _id: null, name: "", class: "" });
        setIsModalOpen(false);
    };

    const handleEdit = (record) => {
        setFormData(record);
        setIsModalOpen(true);
    };

    const handleDelete = (_id, className) => {
        setClasses((prev) =>
            prev.map((cls) =>
                cls.nameClass === className
                    ? { ...cls, studentID: cls.studentID.filter((student) => student._id !== _id) }
                    : cls
            )
        );
    };

    const columns = [
        {
            title: "Tên Học Sinh",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Lớp",
            dataIndex: "class",
            key: "class",
            sorter: (a, b) => a.class.localeCompare(b.class),
        },
        {
            title: "Hành Động",
            key: "actions",
            render: (text, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id, record.class)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ height: "100vh" }}>
            <Breadcrumb title="Quản lí học sinh trong lớp" onBack={() => { }} displayButton={false} />

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
                            placeholder="Tìm kiếm học sinh"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Chọn lớp"
                            style={{ width: "100%" }}
                            onChange={(value) => setFilterClass(value)}
                            allowClear
                        >
                            {classes.map((cls) => (
                                <Option key={cls.nameClass} value={cls.nameClass}>
                                    {cls.nameClass}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalOpen(true)}
                            style={{ width: "100%" }}
                        >
                            Thêm Học Sinh
                        </Button>
                    </Col>
                </Row>
                <Table
                    dataSource={filteredStudents}
                    columns={columns}
                    rowKey="_id"
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
                title={formData._id ? "Cập Nhật Học Sinh" : "Thêm Học Sinh"}
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleAddOrEdit}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên Học Sinh" required>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Lớp" required>
                        <Select
                            value={formData.class}
                            onChange={(value) =>
                                setFormData({ ...formData, class: value })
                            }
                            style={{ width: "100%" }}
                        >
                            {classes.map((cls) => (
                                <Option key={cls.nameClass} value={cls.nameClass}>
                                    {cls.nameClass}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default App;
