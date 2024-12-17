import React, { useEffect, useState } from 'react';
import Toggle from '../../components/Toggle/Toggle';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import * as ClassService from "../../services/ClassService";
import * as SubjectService from "../../services/SubjectService";
import * as ScoreSbujectService from "../../services/ScoreSbujectService";
import * as ScheduleService from "../../services/ScheduleService";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { GrView } from "react-icons/gr";
import { toast } from "react-toastify";
import AbsenceRequestList from '../../components/AbsentRequestList/AbsentRequestList';
import AttendanceSummary from '../../components/AttendanceSummary/AttendanceSummary';
import SearchInput from '../../components/InputSearchComponent/InputSearchComponent';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [studentsAbsent, setStudentsAbsent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentScores, setStudentScores] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { idClass, idSchedule, idSlot, idSubject, semester } = useParams();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [absenceTypes, setAbsenceTypes] = useState({});
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [score, setScore] = useState();
  const [filteredStudents, setFilteredStudents] = useState(students);
  const location = useLocation();
  const { year, week } = location.state || {};
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [targetSlot, setTargetSlot] = useState(null);
  const [detailClass, setDetailClass] = useState();
  const [idSubjectOfSJCD, setIdSubjectOfSJCD] = useState();
  const [detailSubject, setDetailSubject] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [content, setContent] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);

  const slot = queryParams.get("slot");
  const date = queryParams.get("date");

  function convertDate(dateString) {
    // Tách ngày, tháng, năm từ chuỗi nhập vào
    const [day, month, year] = dateString.split('/');

    // Tạo ngày mới với định dạng YYYY-MM-DD
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  console.log(slot, convertDate(date))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await ClassService.getDetailClass(idClass);
        if (classData && classData.data) {
          setDetailClass(classData.data);
        } else {
          setError('Class data not found.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching students. Please try again later.');
      }
    };

    fetchData();
  }, [idClass]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectData = await SubjectService.getDetailSubject(idSubject);
        console.log(subjectData)
        if (subjectData) {
          setDetailSubject(subjectData);
          setIdSubjectOfSJCD(subjectData.baseSubject)
        } else {
          setError('Class data not found.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching students. Please try again later.');
      }
    };

    fetchData();
  }, [idSubject]);

  // console.log("123123", detailSubject)



  const isSubjectInChuyenDe = (idSubject, data) => {
    if (!data) {
      return false;
    }

    return data.some(subject => subject._id === idSubject);
  };

  const isSubjectPhu = (idSubject, data) => {
    if (!data) {
      return false;
    }

    return data.some(subject => subject._id === idSubject);
  };





  useEffect(() => {
    if (year && week) {
      console.log('Year:', year, 'Week:', week);
    }
  }, [year, week]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await ClassService.getStudentInClass(idClass);
        if (!studentsData || !studentsData.data) {
          setError('Class not found');
        } else {
          setStudents(studentsData.data.map(student => ({ ...student, status: true })));
          setError('');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching students. Please try again later.');
      }
    };
    fetchData();
  }, [idClass]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy dữ liệu về lịch học (schedules)
        const schedulesData = await ScheduleService.getDetailScheduleById(idSchedule);

        console.log("schedule", schedulesData)
        setDayOfWeek(schedulesData.data.dayOfWeek);


        // Tìm slot dựa vào slotId
        const targetSlot = schedulesData?.data?.slots?.find(slot => slot._id === idSlot);
        setTargetSlot(targetSlot);
        console.log(targetSlot)
        if (targetSlot) {
          // Lấy danh sách absentStudentId từ slot tương ứng
          const absentStudents = targetSlot.absentStudentId;
          setStudentsAbsent(absentStudents);

          // Lấy danh sách học sinh trong lớp (students)
          const studentsData = await ClassService.getStudentInClass(idClass);
          if (!studentsData || !studentsData.data) {
            setError('Class not found');
          } else {
            // Duyệt qua danh sách students và cập nhật trạng thái dựa vào danh sách absentStudents
            const updatedStudents = studentsData.data.map(student => {

              const absentInfo = absentStudents.find(absentStudent => absentStudent.studentId === student._id);

              return {
                ...student,
                status: !absentInfo, // Đặt `status` là false nếu học sinh có mặt trong `absentStudents`
                isExcused: absentInfo ? absentInfo.isExcused : false // Đặt `isExcused` dựa trên `absentInfo`
              };
            });
            // Cập nhật danh sách sinh viên
            setStudents(updatedStudents);
            setIsInitialLoadComplete(true); // Đánh dấu đã tải xong dữ liệu

            // Khởi tạo `absenceTypes` với giá trị ban đầu từ `absentStudents`
            const initialAbsenceTypes = {};
            absentStudents.forEach(absent => {
              initialAbsenceTypes[absent.studentId] = absent.isExcused ? 'Excused' : 'Unexcused';
            });
            setAbsenceTypes(initialAbsenceTypes);
          }
        } else {
          console.log(`Slot với ID ${idSlot} không được tìm thấy.`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      }
    };

    fetchData();
  }, [idClass, idSchedule, idSlot]);

  useEffect(() => {
    setFilteredStudents(students); // Khởi tạo filteredStudents với toàn bộ danh sách students khi trang tải
  }, [students]);

  // Chạy khi students hoặc studentsAbsent thay đổi

  const toggleStatus = (id) => {
    setStudents((prevStudents) => {
      const updatedStudents = prevStudents.map(student =>
        student._id === id ? { ...student, status: !student.status } : student
      );
      return updatedStudents;
    });

    setAbsenceTypes(prevTypes => {
      const updatedTypes = { ...prevTypes };

      // Check the current status of the student
      const student = students.find(student => student._id === id);

      if (student && student.status === true) {
        // If the student is being toggled to absent (status: false), set to "Unexcused" if undefined
        updatedTypes[id] = updatedTypes[id] || 'Unexcused';
      } else {
        // If the student is being toggled to present (status: true), remove the absence record
        delete updatedTypes[id];
      }

      return updatedTypes;
    });
  };

  const handleAbsenceTypeChange = (id, type) => {
    setAbsenceTypes(prevTypes => ({
      ...prevTypes,
      [id]: type
    }));
  };

  const mutation = useMutation({
    mutationFn: async (newAbsentStudents) => {
      // Call the ScheduleService để gửi dữ liệu cập nhật absent students
      return ScheduleService.updateAbsentstudentId(idSchedule, idClass, idSlot, newAbsentStudents);
    },
    onSuccess: (data) => {
      // Display success toast và log dữ liệu đã cập nhật
      toast.success("Absent students updated successfully!");
      // navigate("/manage/calender")
      console.log("Absent students updated:", data);
    },
    onError: (error) => {
      // Hiển thị lỗi nếu có
      toast.error("Error updating absent students.");
      console.error("Error updating absent students:", error.message);
    },
  });

  const saveStudents = () => {
    // const newAbsentStudents = students
    //   .filter(student => student.status === false) // Lọc học sinh vắng mặt
    //   .map(student => ({
    //     studentId: student._id, // Sử dụng studentId thay vì id
    //     isExcused: absenceTypes[student._id] === 'Excused' // Đặt isExcused dựa trên absenceTypes
    //   }));

    // console.log("Inactive Student IDs with Absence Type:", newAbsentStudents);

    // // Đảm bảo inactiveStudentIds là mảng
    // if (!Array.isArray(newAbsentStudents)) {
    //   console.error("newAbsentStudents is not an array:", newAbsentStudents);
    //   return;
    // }

    // // Gọi mutation để cập nhật danh sách học sinh vắng
    // mutation.mutate(newAbsentStudents);

    setIsOpenModal(true)
  };


  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    setFilteredStudents(
      students.filter((student) =>
        student.name.toLowerCase().includes(lowercasedQuery)
      )
    );
  };

  const totalStudents = students.length;
  const presentCount = students.filter(student => student.status).length;
  const excusedCount = students.filter(student => absenceTypes[student._id] === 'Excused').length;
  const unexcusedCount = students.filter(student => absenceTypes[student._id] === 'Unexcused').length;

  // Create the data object for attendance summary
  const attendanceSummary = {
    total: totalStudents,
    present: presentCount,
    excused: excusedCount,
    unexcused: unexcusedCount,
  };

  const handleClose = () => setIsOpenModal(false);

  const handleSaveSlot = async (classId, scheduleId, slotId, content, score) => {
    const newAbsentStudents = students
      .filter(student => student.status === false) // Lọc học sinh vắng mặt
      .map(student => ({
        studentId: student._id,
        isExcused: absenceTypes[student._id] === 'Excused', // Đặt isExcused dựa trên absenceTypes
      }));

    console.log("Inactive Student IDs with Absence Type:", newAbsentStudents);

    setIsLoading(true); // Bắt đầu trạng thái tải

    try {
      // Gửi danh sách học sinh vắng mặt và nội dung notebook
      await ScheduleService.createNoteBookByClassAndScheduleId(classId, scheduleId, slotId, content, score);

      console.log('Notebook and absence list saved successfully!');
      toast.success('Notebook and absence list saved successfully!');

      // Gọi mutation nếu cần (giả định mutation có sẵn)
      mutation.mutate(newAbsentStudents);
    } catch (error) {
      console.error('Failed to save notebook or absent students:', error.message);
      toast.error('Failed to save notebook or absent students.');
    } finally {
      setIsLoading(false); // Kết thúc trạng thái tải
    }
  };


  console.log(content)

  return (
    <div className="flex flex-col w-full h-screen bg-white w-[95%] mx-auto pb-4">
      {isLoading && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
        >
          <div className="spinner-border text-white" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-white text-xl ml-4">Đang tải...</p>
        </div>
      )}
      <div className="bg-white pt-2 pr-4 flex justify-end">

        <button
          onClick={saveStudents}
          className="bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Hoàn thành điểm danh
        </button>
      </div>
      <div className="flex h-full overflow-hidden">
        <div
          style={{
            borderRadius: "20px",
            borderLeft: "1px solid rgb(229, 231, 235)",
            borderRight: "1px solid rgb(229, 231, 235)",
            borderBottom: "1px solid rgb(229, 231, 235)",
            boxShadow: "rgb(213, 213, 213) 0px 0px 3px 0px"
          }}
          className="w-3/4 overflow-x-auto h-full mr-6 ml-4">
          <div className="bg-white h-full">
            <div className="mb-4 w-full" style={{ width: "100%" }}>
              <AttendanceSummary data={attendanceSummary} className="w-full" style={{ width: "100%" }} />
            </div>
            <div className="mx-4">
              <SearchInput onSearch={handleSearch} />
            </div>
            <table className="min-w-full bg-blue-500 table-auto">
              <thead>
                <tr>
                  <th style={{ width: "5%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-white uppercase tracking-wider"></th>
                  <th style={{ width: "25%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-white uppercase tracking-wider">Tên</th>
                  <th style={{ width: "20%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-white uppercase tracking-wider">Ngày sinh</th>
                  <th style={{ width: "20%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-white uppercase tracking-wider">Điểm danh</th>
                  <th style={{ width: "15%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-white uppercase tracking-wider">Trạng thái</th>

                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                      {/* <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-4" /> */}
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Toggle
                        isOn={student.status} // Dùng status để kiểm soát trạng thái của Toggle
                        handleToggle={() => toggleStatus(student._id)}
                        userId={student._id}
                        onColor="bg-green-500"
                        offColor="bg-red-500"
                        tooltipText={student.status ? (student.isAbsent ? 'Vắng mặt' : 'Đã điểm danh') : 'Chưa điểm danh'}
                      />

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!student.status && (
                        <select
                          value={absenceTypes[student._id] || ""}
                          onChange={(e) => handleAbsenceTypeChange(student._id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 bg-white"
                        >
                          <option value="Excused">Có phép</option>
                          <option value="Unexcused">Không phép</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-1/4 h-full flex flex-col overflow-auto mr-4">
          <AbsenceRequestList
            idClass={idClass}
            year={year}
            week={week}
            dayOfWeek={dayOfWeek}
            targetSlot={targetSlot}
            slot={slot}
            date={convertDate(date)}
          />
        </div>
        <Modal show={isOpenModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Đánh giá tiết học</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                as="textarea"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content for the file"
              />
              <Form.Group className="mt-3">
                <Form.Label>Điểm tiết học</Form.Label>
                <Form.Control
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Nhập điểm tiết học"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() =>
                handleSaveSlot(
                  idClass,          // classId
                  idSchedule,       // scheduleId
                  idSlot,           // slotId
                  content,          // Nội dung từ state content
                  score             // Điểm từ state score
                )
              }
              disabled={isLoading} // Disable button khi đang tải
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
};

export default StudentTable;