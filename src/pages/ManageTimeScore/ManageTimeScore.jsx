import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Input,
    Select,
    Layout,
    Row,
    Col,
    Space,
    Modal,
    Form,
    DatePicker,
    Spin,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import * as SubjectService from "../../services/SubjectService";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import moment from "moment";
const { Search } = Input;
const { Option } = Select;
const { Content } = Layout;

const ManageTimeScore = () => {
    const currentYear = new Date().getFullYear();
    const [searchTerm, setSearchTerm] = useState("");
    const [tableScrollHeight, setTableScrollHeight] = useState(300);
    const [isLoading, setIsLoading] = useState(false);
    const [yearRange, setYearRange] = useState(`${currentYear}-${currentYear + 1}`);
    const [semesters, setSemesters] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchInfoBlock = async () => {
            try {
                setIsLoading(true);
                const data = await SubjectService.getAllSemesterByYear(yearRange);
                setSemesters(data.semesters);
            } catch (error) {
                console.error("Error fetching semester data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInfoBlock();
    }, [yearRange]);

    useEffect(() => {
        const calculateTableHeight = () => {
            const screenHeight = window.innerHeight;
            const reservedHeight = 350;
            const newHeight = screenHeight - reservedHeight;
            setTableScrollHeight(newHeight > 300 ? newHeight : 300);
        };

        calculateTableHeight();
        window.addEventListener("resize", calculateTableHeight);

        return () => window.removeEventListener("resize", calculateTableHeight);
    }, []);

    const handleEdit = (record) => {
        const today = new Date();
        setEditingRecord(record);

        // Chuyển đổi chuỗi dateStart và dateEnd thành moment trước khi đặt giá trị
        form.setFieldsValue({
            dateStart: record.dateStart ? moment(record.dateStart, "DD/MM/YYYY") : moment(today),
            dateEnd: record.dateEnd ? moment(record.dateEnd, "DD/MM/YYYY") : moment(today),
        });

        setIsModalVisible(true);
    };


    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            // Call API to update the record

            console.log(values.dateStart.format("DD/MM/YYYY").toString())
            console.log(values.dateEnd.format("DD/MM/YYYY").toString())
            console.log(editingRecord._id)
            // await SubjectService.updateSemester(editingRecord._id, {
            //     dateStart: values.dateStart.format("DD/MM/YYYY").toString(),
            //     dateEnd: values.dateEnd.format("DD/MM/YYYY").toString(),
            // });
            toast.success("Cập nhật thành công");
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error updating semester:", error);
            toast.error("Có lỗi xảy ra khi cập nhật");
        }
    };

    const columns = [
        {
            title: "Khối",
            dataIndex: ["blockId", "nameBlock"],
            key: "nameBlock",
            sorter: (a, b) => (a.blockId?.nameBlock || "").localeCompare(b.blockId?.nameBlock || ""),
        },
        {
            title: "Học Kì",
            dataIndex: "nameSemester",
            key: "nameSemester",
            sorter: (a, b) => (a.nameSemester || "").localeCompare(b.nameSemester || ""),
        },
        {
            title: "Thời Bắt Đầu",
            dataIndex: "dateStart",
            key: "dateStart",
            sorter: (a, b) => (a.dateStart || "").localeCompare(b.dateStart || ""),
        },
        {
            title: "Thời Gian Kết thúc",
            dataIndex: "dateEnd",
            key: "dateEnd",
            sorter: (a, b) => (a.dateEnd || "").localeCompare(b.dateEnd || ""),
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
            <Breadcrumb title="Quản lí thời gian điểm" onBack={onBack} displayButton={false} />
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
                            placeholder="Chọn năm học"
                            style={{ width: "100%" }}
                            onChange={(value) => setYearRange(value)}
                            allowClear
                        >
                            <Option value={`${currentYear - 1}-${currentYear}`}>{`${currentYear - 1}-${currentYear}`}</Option>
                            <Option value={`${currentYear}-${currentYear + 1}`}>{`${currentYear}-${currentYear + 1}`}</Option>
                            <Option value={`${currentYear + 1}-${currentYear + 2}`}>{`${currentYear + 1}-${currentYear + 2}`}</Option>
                        </Select>
                    </Col>
                </Row>
                <Table
                    dataSource={semesters}
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

                <Modal
                    title="Cập nhật thời gian"
                    visible={isModalVisible}
                    onOk={handleUpdate}
                    onCancel={() => {
                        setIsModalVisible(false);
                        form.resetFields();
                    }}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="dateStart"
                            label="Thời gian bắt đầu"
                            rules={[
                                { required: true, message: "Vui lòng chọn thời gian bắt đầu!" },

                            ]}
                        >
                            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item
                            name="dateEnd"
                            label="Thời gian kết thúc"
                            rules={[
                                { required: true, message: "Vui lòng chọn thời gian kết thúc!" },

                            ]}
                        >
                            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Form>
                </Modal>

            </Content>
        </Layout>
    );
};

export default ManageTimeScore;
