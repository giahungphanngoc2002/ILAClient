import React, { useEffect, useState } from "react";
import { Table, Layout, Row, Col, Select, Button, Input, Modal } from "antd";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useSelector } from "react-redux";
import * as ClassService from "../../services/ClassService";
import * as ExamScheduleService from "../../services/ExamScheduleService";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const ExamSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [examSchedule , setExamSchedule] = useState();
  const user = useSelector((state) => state.user);


  const [classSubject, setClassSubject] = useState(null);
  const [blockClassUser, setBlockClassUser] = useState();

  const findUserClass = (allClasses, userId) => {
    if (!Array.isArray(allClasses)) {
      console.error('All classes is not a valid array:', allClasses);
      return null;
    }

    const foundClass = allClasses.find((classItem) => {
      return (
        Array.isArray(classItem.studentID) &&
        classItem.studentID.some((student) =>
          typeof student === 'string'
            ? student === userId
            : student._id === userId
        )
      );
    });

    if (!foundClass) {
      console.warn('No class found for user:', userId);
    }

    return foundClass;
  };

  // Hàm chính để fetch classes và tìm class
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const allClasses = await ClassService.getAllClass();
        const userClass = findUserClass(allClasses?.data || [], user.id);
        console.log(userClass)
        if (userClass && userClass?.blockID) {
          setBlockClassUser(userClass.blockID);
        } else {
          console.error("Không tìm thấy classSubject phù hợp!");
        }
        if (userClass && userClass.subjectGroup?.SubjectsId) {
          setClassSubject(userClass.subjectGroup.SubjectsId);
        } else {
          console.error("Không tìm thấy classSubject phù hợp!");
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [user.id]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const allExamSchedule = await ExamScheduleService.getAllExamScheduleByBlock(blockClassUser?._id);
        console.log(allExamSchedule)
        // if (allExamSchedule) {
        //   setExamSchedule(userClass.subjectGroup.SubjectsId);
        // } else {
        //   console.error("Không tìm thấy classSubject phù hợp!");
        // }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [blockClassUser?._id]);

  console.log(classSubject)
  console.log(blockClassUser?._id)



  // Columns configuration for Ant Design Table
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

  // Fetch schedule data or define statically
  useEffect(() => {
    const fetchSchedule = async () => {
      const mockSchedule = [
        {
          subject: "Toán Cao Cấp",
          date: "2024-12-10",
          startTime: "08:00 AM",
          endTime: "10:00 AM",
          duration: "120 phút",
        },
        {
          subject: "Lập Trình C++",
          date: "2024-12-12",
          startTime: "01:00 PM",
          endTime: "03:00 PM",
          duration: "120 phút",
        },
        {
          subject: "Vật Lý Đại Cương",
          date: "2024-12-14",
          startTime: "09:00 AM",
          endTime: "11:00 AM",
          duration: "120 phút",
        },
        {
          subject: "Vật Lý Đại Cương 1",
          date: "2024-12-14",
          startTime: "09:00 AM",
          endTime: "11:00 AM",
          duration: "120 phút",
        },
        {
          subject: "Vật Lý Đại Cương 2",
          date: "2024-12-14",
          startTime: "09:00 AM",
          endTime: "11:00 AM",
          duration: "120 phút",
        },
        {
          subject: "Vật Lý Đại Cương 3",
          date: "2024-12-14",
          startTime: "09:00 AM",
          endTime: "11:00 AM",
          duration: "120 phút",
        },
        {
          subject: "Vật Lý Đại Cương 4",
          date: "2024-12-14",
          startTime: "09:00 AM",
          endTime: "11:00 AM",
          duration: "120 phút",
        },
      ];

      setSchedule(mockSchedule);
      setFilteredSchedule(mockSchedule);
    };

    fetchSchedule();
  }, []);

  // Filter based on search
  useEffect(() => {
    const filtered = schedule.filter(
      (exam) =>
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.date.includes(searchTerm)
    );
    setFilteredSchedule(filtered);
  }, [searchTerm, schedule]);

  const onBack = () => {
    window.history.back();
  };

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
        />
      </Content>
    </Layout>
  );
};

export default ExamSchedule;
