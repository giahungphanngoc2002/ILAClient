import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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
    Checkbox,
    Upload
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
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

    console.log(filteredStudents)


    // const handleSelectChange = (studentId, checked) => {
    //     setSelectedStudents((prevSelected) => {
    //         if (checked) {
    //             return [...prevSelected, studentId]; // Thêm studentId vào danh sách đã chọn
    //         } else {
    //             return prevSelected.filter((id) => id !== studentId); // Xóa studentId khỏi danh sách đã chọn
    //         }
    //     });
    // };

    const columns = [
        {
            title: "Tên Học Sinh",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Tài khoản",
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: "Chọn",
            key: "select",
            render: (text, record) => (
                <Select
                    placeholder="Chọn lớp"
                    style={{ width: "100%" }}
                    onChange={(value) => {
                        const updatedStudents = filteredStudents.map((student) =>
                            student._id === record._id
                                ? { ...student, selectedClass: value }
                                : student
                        );
                        setStudentU(updatedStudents);
                    }}
                    value={record.selectedClass} // Use selectedClass (_id) as value
                    allowClear
                >
                    {classes.map((cls) => (
                        <Option key={cls._id} value={cls._id}>
                            {cls.nameClass}
                        </Option>
                    ))}
                </Select>
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

    const handleAddStudentToClass = () => {
        // Lọc ra danh sách học sinh đã có giá trị selectedClass
        const selectedStudentsWithClass = studentU.filter(
            (student) => student.selectedClass
        );

        // In ra danh sách học sinh
        console.log("Danh sách học sinh đã chọn lớp:", selectedStudentsWithClass);

        // Optional: Hiển thị thông báo nếu không có học sinh nào được chọn lớp
        if (selectedStudentsWithClass.length === 0) {
            toast.warn("Không có học sinh nào được chọn lớp!");
        } else {
            toast.success("Danh sách học sinh đã chọn lớp được ghi nhận!");
        }

        // Có thể xử lý thêm logic lưu thông tin này vào backend nếu cần
    };



    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Load as array for better control

                // Process the data
                const processedData = [];
                const headers = json[0]; // First row is headers
                for (let i = 1; i < json.length; i++) {
                    const row = json[i];
                    const name = row[0]; // First column
                    const username = row[1]; // Second column

                    for (let j = 2; j < row.length; j++) {
                        if (row[j] === "X") {
                            const className = headers[j];
                            const classObj = classes.find((cls) => cls.nameClass === className);

                            if (classObj) {
                                processedData.push({
                                    name,
                                    username,
                                    classId: classObj._id, // Use _id instead of nameClass
                                });
                            }
                        }
                    }
                }

                // Match processed data with filtered students
                const updatedStudents = filteredStudents.map((student) => {
                    const matched = processedData.find(
                        (item) =>
                            item.name === student.name &&
                            item.username === student.username
                    );
                    return matched
                        ? { ...student, selectedClass: matched.classId }
                        : student;
                });

                setStudentU(updatedStudents); // Update state with matched data
            };
            reader.readAsArrayBuffer(file);
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
                </Row>
                <Table
                    dataSource={
                        filterClass
                            ? filteredStudents.filter(
                                (student) =>
                                    student.selectedClass ===
                                    classes.find((cls) => cls._id === filterClass)?.nameClass
                            )
                            : filteredStudents
                    }
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