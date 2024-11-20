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
import * as UserService from "../../services/UserService";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";

const { Search } = Input;
const { Option } = Select;
const { Content } = Layout;

const App = () => {
    const [classes, setClasses] = useState([]);
    const [studentU, setStudentU] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("");
    const [formData, setFormData] = useState({ _id: null, name: "", class: "" });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [tableScrollHeight, setTableScrollHeight] = useState(300);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setIsLoading(true);
                const data = await ClassService.getAllClass();
                if (data && data.data && Array.isArray(data.data)) {
                    setClasses(data.data);
                }
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const data = await UserService.getAllUser();
                setStudentU(data.data);
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

    const filteredStudents = classes.flatMap((cls) =>
        cls.studentID.map((student) => ({
            name: student.name,
            class: cls.nameClass,
            _id: student._id,
        }))
    ).filter((student) =>
        student?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) &&
        (!filterClass || student.class === filterClass)
    );

    const handleEditStudent = async () => {
        const { _id, name, class: newClassName } = formData;

        try {
            setIsLoading(true);
            const currentClass = classes.find((cls) =>
                cls.studentID.some((student) => student._id === _id)
            );

            if (!currentClass) {
                toast.error("Không tìm thấy lớp hiện tại của học sinh");
                return;
            }

            if (currentClass.nameClass === newClassName) {
                setClasses((prev) =>
                    prev.map((cls) =>
                        cls.nameClass === currentClass.nameClass
                            ? {
                                  ...cls,
                                  studentID: cls.studentID.map((student) =>
                                      student._id === _id ? { ...student, name } : student
                                  ),
                              }
                            : cls
                    )
                );
                toast.success("Cập nhật thông tin học sinh thành công");
            } else {
                const newClass = classes.find((cls) => cls.nameClass === newClassName);

                if (!newClass) {
                    toast.error("Không tìm thấy lớp mới");
                    return;
                }

                await ClassService.transferStudent(_id, currentClass._id, newClass._id);

                setClasses((prev) =>
                    prev.map((cls) => {
                        if (cls.nameClass === currentClass.nameClass) {
                            return {
                                ...cls,
                                studentID: cls.studentID.filter((student) => student._id !== _id),
                            };
                        } else if (cls.nameClass === newClassName) {
                            return {
                                ...cls,
                                studentID: [...cls.studentID, { _id, name }],
                            };
                        }
                        return cls;
                    })
                );

                toast.success(`Học sinh đã được chuyển sang lớp ${newClassName}`);
            }

            setFormData({ _id: null, name: "", class: "" });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error in handleEditStudent:", error);
            toast.error("Lỗi khi chỉnh sửa thông tin học sinh");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddStudent = async () => {
        const { name, class: className } = formData;

        if (!name || !className) {
            toast.error("Vui lòng chọn tên học sinh và lớp!");
            return;
        }

        try {
            setIsLoading(true);

            const selectedClass = classes.find((cls) => cls.nameClass === className);
            if (!selectedClass) {
                toast.error("Không tìm thấy lớp!");
                return;
            }

            await ClassService.addStudentIDToClass(selectedClass._id, name);

            const updatedClasses = await ClassService.getAllClass();
            setClasses(updatedClasses.data);

            toast.success("Học sinh đã được thêm vào lớp thành công!");
            setFormData({ _id: null, name: "", class: "" });
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error in handleAddStudent:", error);
            toast.error("Lỗi khi thêm học sinh vào lớp!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (record) => {
        setFormData(record);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (_id, className) => {
        try {
            setIsLoading(true);
            const classToDelete = classes.find((cls) => cls.nameClass === className);

            if (classToDelete) {
                await ClassService.deleteStudentIDToClass(classToDelete._id, _id);

                setClasses((prev) =>
                    prev.map((cls) =>
                        cls.nameClass === className
                            ? { ...cls, studentID: cls.studentID.filter((student) => student._id !== _id) }
                            : cls
                    )
                );

                toast.success(`Xóa học sinh thành công!`);
            } else {
                toast.error(`Không tìm thấy lớp ${className}.`);
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            toast.error("Lỗi khi xóa học sinh!");
        } finally {
            setIsLoading(false);
        }
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
                            onClick={() => setIsAddModalOpen(true)}
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

            {/* Modal Thêm Học Sinh */}
            <Modal
                title="Thêm Học Sinh"
                visible={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                onOk={handleAddStudent}
                confirmLoading={isLoading}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên Học Sinh" required>
                        <Select
                            placeholder="Chọn học sinh"
                            value={formData.name}
                            onChange={(value) => setFormData({ ...formData, name: value })}
                            style={{ width: "100%" }}
                        >
                            {studentU.map((student) => (
                                <Option key={student.email} value={student.email}>
                                    {student.name} - {student.email}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Lớp" required>
                        <Select
                            placeholder="Chọn lớp"
                            value={formData.class}
                            onChange={(value) => setFormData({ ...formData, class: value })}
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

            {/* Modal Sửa Học Sinh */}
            <Modal
                title="Cập Nhật Học Sinh"
                visible={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={handleEditStudent}
                confirmLoading={isLoading}
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
