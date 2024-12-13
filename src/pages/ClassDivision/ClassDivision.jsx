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
    Checkbox
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as ClassService from "../../services/ClassService";
import * as UserService from "../../services/UserService";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { Content } = Layout;

const ClassDivision = () => {
    const [classes, setClasses] = useState([]);
    const [studentU, setStudentU] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("");
    const [formData, setFormData] = useState({ _id: null, name: "", class: "" });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [pageSize, setPageSize] = useState(1000);
    const [tableScrollHeight, setTableScrollHeight] = useState(300);
    const [isLoading, setIsLoading] = useState(false);
    const [dataClass, setDataClass] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]); // Lưu trữ học sinh đã chọn

    const currentYear = dayjs().year(); // Lấy năm hiện tại

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setIsLoading(true);
                const data = await ClassService.getAllClass();
                setDataClass(data.data);
                if (data && data.data && Array.isArray(data.data)) {
                    const filterNewClass = data?.data.filter((cls) => {
                        return cls.blockID.nameBlock === "10" && cls.year === `${currentYear}-${currentYear + 1}`;
                    });
                    setClasses(filterNewClass);
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

    const filteredStudents = studentU.filter((student) => {
        const isInClass = dataClass.some((cls) =>
            cls.studentID && cls.studentID.some((std) => std._id === student._id)
        );
        return !isInClass;
    });


    console.log(studentU)
    console.log(dataClass)
    console.log(filteredStudents)

    const handleSelectChange = (studentId, checked) => {
        setSelectedStudents((prevSelected) => {
            if (checked) {
                return [...prevSelected, studentId]; // Thêm studentId vào danh sách đã chọn
            } else {
                return prevSelected.filter((id) => id !== studentId); // Xóa studentId khỏi danh sách đã chọn
            }
        });
    };

    const columns = [
        {
            title: "Tên Học Sinh",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Chọn",
            key: "select",
            render: (text, record) => (
                <Checkbox
                    checked={selectedStudents.includes(record._id)} // Kiểm tra nếu học sinh đã được chọn
                    onChange={(e) => handleSelectChange(record._id, e.target.checked)}
                />
            ),
        },
    ];

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

    const onBack = () => {
        window.history.back();
    };

    const handleAddStudentToClass = async () => {
        console.log(selectedStudents);
        console.log(filterClass);

        try {
            setIsLoading(true);
            const response = await ClassService.addStudentIDToClassbyId(filterClass, selectedStudents);
            console.log(response);

            // Sau khi thêm học sinh vào lớp thành công, cập nhật lại danh sách học sinh chưa có lớp
            setStudentU((prevStudents) =>
                prevStudents.filter((student) => !selectedStudents.includes(student._id)) // Loại bỏ học sinh đã chọn
            );

            // Hiển thị thông báo thành công
            toast.success("Thêm học sinh thành công");
            // Xóa lựa chọn học sinh
            setSelectedStudents([]);
        } catch (error) {
            console.error('Error adding students to class:', error);
            toast.error("Có lỗi xảy ra khi thêm học sinh");
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <Layout style={{ height: "100vh" }}>
            <Breadcrumb
                title="Chia học sinh"
                onBack={onBack}
                buttonText={isLoading ? "Đang xử lý..." : "Thêm học sinh vào lớp"}
                onButtonClick={handleAddStudentToClass}
                disabled={isLoading}
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
                        <Search
                            placeholder="Tìm kiếm học sinh"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            value={`${currentYear} - ${currentYear + 1}`}
                            disabled
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
                                <Option key={cls.nameClass} value={cls._id}>
                                    {cls.nameClass}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Table
                    dataSource={filteredStudents}
                    columns={columns}
                    rowKey="_id"
                    pagination={{
                        pageSize,
                        position: ["bottomCenter"],
                    }}
                    bordered
                    scroll={{
                        x: "max-content",
                        y: tableScrollHeight,
                    }}
                    style={{ width: "100%", borderRadius: "8px" }}
                />
            </Content>
        </Layout>
    );
};

export default ClassDivision;
