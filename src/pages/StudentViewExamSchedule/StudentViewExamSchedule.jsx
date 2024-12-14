import React, { useEffect, useState } from "react";
import { Table, Layout, Row, Col, Input } from "antd";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useSelector } from "react-redux";
import * as ClassService from "../../services/ClassService";
import * as ExamScheduleService from "../../services/ExamScheduleService";
import "./style.css";

const { Content } = Layout;
const { Search } = Input;

const StudentViewExamSchedule = () => {
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [examSchedule, setExamSchedule] = useState([]);
  const [classSubject, setClassSubject] = useState([]);
  const [blockClassUser, setBlockClassUser] = useState();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const findUserClass = (allClasses, userId) => {
    if (!Array.isArray(allClasses)) {
      console.error("All classes is not a valid array:", allClasses);
      return null;
    }

    const foundClass = allClasses.find((classItem) => {
      return (
        Array.isArray(classItem.studentID) &&
        classItem.studentID.some((student) =>
          typeof student === "string"
            ? student === userId
            : student._id === userId
        )
      );
    });

    if (!foundClass) {
      console.warn("No class found for user:", userId);
    }

    return foundClass;
  };

  // Tính thời gian làm bài
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "Không rõ";

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    const durationInMinutes = (end - start) / (1000 * 60);

    return durationInMinutes > 0 ? `${durationInMinutes} phút` : "Không hợp lệ";
  };

  // Fetch classes và tìm block của user
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const allClasses = await ClassService.getAllClass();
        const userClass = findUserClass(allClasses?.data || [], user.id);
        if (userClass && userClass?.blockID) {
          setBlockClassUser(userClass.blockID);
        } else {
          console.error("Không tìm thấy blockClassUser phù hợp!");
        }
        if (userClass && userClass?.SubjectsId) {
          setClassSubject(userClass?.SubjectsId || []);
        } else {
          console.error("Không tìm thấy classSubject phù hợp!");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [user.id]);

  // Fetch exam schedule theo block của user
  useEffect(() => {
    const fetchExamSchedules = async () => {
      if (!blockClassUser?._id) return; // Nếu không có _id thì không gọi API
      setLoading(true);

      try {
        const data = await ExamScheduleService.getAllExamScheduleByBlock(
          blockClassUser._id
        );
        setExamSchedule(data || []); // Đảm bảo state không undefined
      } catch (err) {
        console.error(err); // Log lỗi nếu có
      } finally {
        setLoading(false);
      }
    };

    fetchExamSchedules();
  }, [blockClassUser?._id]);
  console.log(examSchedule)

  // Kết hợp `classSubject` và `examSchedule`
  useEffect(() => {
    if (!classSubject.length) return;
  
    const combinedSchedule = classSubject
      .map((subject) => {
        const exam = examSchedule.find(
          (examItem) => examItem.subjectId?._id === subject._id
        );
  
        // Chỉ thêm vào lịch thi nếu có dữ liệu về thời gian thi
        if (exam && exam.day && exam.timeStart && exam.timeEnd) {
          return {
            subject: subject.nameSubject || "N/A",
            date: exam.day || "Chưa rõ",
            startTime: exam.timeStart || "Chưa rõ",
            endTime: exam.timeEnd || "Chưa rõ",
            duration: calculateDuration(exam.timeStart, exam.timeEnd),
          };
        }
  
        // Không trả về gì nếu không có lịch thi hợp lệ
        return null;
      })
      .filter(Boolean);  // Loại bỏ các giá trị null (những môn không có lịch thi)
  
    // Filter theo `searchTerm`
    const searched = combinedSchedule.filter(
      (exam) =>
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.date.includes(searchTerm)
    );
  
    setFilteredSchedule(searched);
  }, [classSubject, examSchedule, searchTerm]);

  const onBack = () => {
    window.history.back();
  };

  const columns = [
    {
      title: "Môn Học",
      dataIndex: "subject",
      key: "subject",
      sorter: (a, b) => a.subject.localeCompare(b.subject),
    },
    {
      title: "Ngày Thi",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Thời Gian Bắt Đầu",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Thời Gian Kết Thúc",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Thời Gian Làm Bài",
      dataIndex: "duration",
      key: "duration",
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Breadcrumb title="Lịch Thi" onBack={onBack} displayButton={false} />

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
              placeholder="Tìm kiếm môn học hoặc ngày thi"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
        <Table
          dataSource={filteredSchedule}
          columns={columns}
          rowKey="subject"
          pagination={{
            pageSize: 10,
            position: ["bottomCenter"],
          }}
          bordered
          style={{ width: "100%", borderRadius: "8px" }}
          loading={loading}
          className="custom-table"
        />
      </Content>
    </Layout>
  );
};

export default StudentViewExamSchedule;
