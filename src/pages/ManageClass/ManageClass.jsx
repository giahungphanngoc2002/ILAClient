import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Input,
    Select,
    Modal,
    Form,
    Layout,
    Typography,
    Row,
    Col,
    Space,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "./style.css"; // Đường dẫn tới file CSS

const { Search } = Input;
const { Option } = Select;
const { Content } = Layout;

const App = () => {
    const [classes, setClasses] = useState([
        {
            class: "10A1",
            students: Array.from({ length: 20 }, (_, i) => ({
                _id: i + 1,
                name: `Nguyễn Văn ${String.fromCharCode(65 + i)}`,
            })),
        },
        {
            class: "10A2",
            students: Array.from({ length: 20 }, (_, i) => ({
                _id: i + 21,
                name: `Trần Thị ${String.fromCharCode(65 + i)}`,
            })),
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("");
    const [formData, setFormData] = useState({ _id: null, name: "", class: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10); // Số dòng hiển thị mỗi trang

    useEffect(() => {
        const updatePageSize = () => {
            // Tính toán số dòng hiển thị dựa trên chiều cao màn hình
            const availableHeight = window.innerHeight - 300; // Giảm chiều cao cố định (Header, Breadcrumb, Footer)
            const rowHeight = 50; // Chiều cao trung bình mỗi dòng
            const calculatedPageSize = Math.floor(availableHeight / rowHeight);
            setPageSize(calculatedPageSize > 0 ? calculatedPageSize : 1); // Tối thiểu 1 dòng
        };

        updatePageSize();
        window.addEventListener("resize", updatePageSize);

        return () => {
            window.removeEventListener("resize", updatePageSize);
        };
    }, []);

    const filteredStudents = classes
        .filter((cls) => (filterClass ? cls.class === filterClass : true))
        .flatMap((cls) =>
            cls.students
                .filter((student) =>
                    student.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((student) => ({ ...student, class: cls.class }))
        );

    const handleAddOrEdit = () => {
        const { _id, name, class: className } = formData;

        setClasses((prev) => {
            const updatedClasses = [...prev];
            const classIndex = updatedClasses.findIndex((cls) => cls.class === className);

            if (_id) {
                updatedClasses[classIndex].students = updatedClasses[classIndex].students.map(
                    (student) => (student._id === _id ? { _id, name } : student)
                );
            } else {
                updatedClasses[classIndex].students.push({
                    _id: Date.now(),
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
                cls.class === className
                    ? { ...cls, students: cls.students.filter((student) => student._id !== _id) }
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
                    height: "calc(100vh - 64px - 40px)",
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
                                <Option key={cls.class} value={cls.class}>
                                    {cls.class}
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
                    pagination={{ pageSize }}
                    bordered
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
                                <Option key={cls.class} value={cls.class}>
                                    {cls.class}
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
