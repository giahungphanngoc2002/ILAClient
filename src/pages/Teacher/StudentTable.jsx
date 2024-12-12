import React, { useEffect, useState } from 'react';
import Toggle from '../../components/Toggle/Toggle';
import { Modal, Button, Dropdown } from 'react-bootstrap';
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
  const [semesterScores, setSemesterScores] = useState({
    1: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
    2: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' }
  });
  const [filteredStudents, setFilteredStudents] = useState(students);
  const location = useLocation();
  const { year, week } = location.state || {};
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [targetSlot, setTargetSlot] = useState(null);
  const [detailClass, setDetailClass] = useState();
  const [idSubjectOfSJCD, setIdSubjectOfSJCD] = useState();
  const [detailSubject, setDetailSubject] = useState();

  console.log(detailSubject)

  console.log("idSubject", detailSubject)

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

  // console.log(isSubjectInChuyenDe(idSubject, detailClass?.subjectGroup.SubjectsChuyendeId));

  console.log(isSubjectPhu(idSubject, detailClass?.subjectGroup.SubjectsPhuId))

  useEffect(() => {
    if (year && week) {
      console.log('Year:', year, 'Week:', week);
    }
  }, [year, week]);

  useEffect(() => {
    if (semesterScores[selectedSemester]) {
      setStudentScores((prev) => ({
        ...prev,
        scores: semesterScores[selectedSemester],
      }));
    }
  }, [selectedSemester, semesterScores]);

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
  const processScores = (scoresData, semester) => {
    const allScoresData = scoresData || [];  // Nếu không có dữ liệu, sử dụng mảng rỗng
    const scoreId = allScoresData.length > 0 ? allScoresData[0]._id : null;

    // Phân loại điểm theo loại và học kỳ
    const categorizedScores = {
      diemThuongXuyen: allScoresData
        .flatMap(data => data.scores)
        .filter(score => score.type === 'thuongXuyen' && score.semester === semester)
        .map(score => score.score),
      diemGiuaKi: allScoresData
        .flatMap(data => data.scores)
        .filter(score => score.type === 'giuaKi' && score.semester === semester)
        .map(score => score.score),
      diemCuoiKi: allScoresData
        .flatMap(data => data.scores)
        .filter(score => score.type === 'cuoiKi' && score.semester === semester)
        .map(score => score.score)[0] || '',  // Nếu không có điểm cuối kỳ, mặc định là chuỗi rỗng
    };

    return { categorizedScores, scoreId };
  };

  const openModal = async (student) => {
    try {
      // Kiểm tra xem môn học có phải là Chuyên đề không
      const subjectToUse = isSubjectInChuyenDe(idSubject, detailClass?.subjectGroup.SubjectsChuyendeId)
        ? idSubjectOfSJCD // Nếu là Chuyên đề thì dùng idSubjectOfSJCD
        : idSubject; // Nếu không thì dùng idSubject mặc định

      // Fetch scores for semester 1
      const scoresDataSemester1 = await ScoreSbujectService.getAllScoresBySubject(subjectToUse, idClass, 1, student._id);
      const semester1 = processScores(scoresDataSemester1, 1);

      // Try to fetch scores for semester 2, but handle any potential errors for semester 2 independently
      let semester2 = { categorizedScores: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' }, scoreId: null };
      try {
        const scoresDataSemester2 = await ScoreSbujectService.getAllScoresBySubject(subjectToUse, idClass, 2, student._id);
        semester2 = processScores(scoresDataSemester2, 2);
      } catch (error) {
        console.warn('Error fetching scores for semester 2:', error);
      }

      // Initialize semesterScores with the data that was successfully fetched
      setSemesterScores({
        1: semester1.categorizedScores,
        2: semester2.categorizedScores,
      });

      // Store scoreId per semester and set student scores
      setStudentScores({
        name: student.name,
        id: student._id,
        scoreIds: { 1: semester1.scoreId, 2: semester2.scoreId },
        scores: {
          1: semester1.categorizedScores,
          2: semester2.categorizedScores,
        },
      });

      setShowModal(true);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setError(error.message || 'Error fetching scores. Please try again later.');

      // Initialize with empty data if there's an error
      setSemesterScores({
        1: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
        2: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
      });

      setStudentScores({
        name: student.name,
        id: student._id,
        scoreIds: { 1: null, 2: null },
        scores: {
          1: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
          2: { diemThuongXuyen: [], diemGiuaKi: [], diemCuoiKi: '' },
        },
      });

      setShowModal(true);
    }
  };


  const closeModal = () => {
    setShowModal(false);
    setStudentScores(null);
  };

  const handleScoreChange = (type, index, value) => {
    setSemesterScores((prevSemesterScores) => {
      const updatedScores = { ...prevSemesterScores[selectedSemester] };
      if (type === 'diemCuoiKi') {
        updatedScores.diemCuoiKi = value;
      } else if (type === 'diemGiuaKi') {
        updatedScores.diemGiuaKi = value;
      } else {
        updatedScores[type][index] = value;
      }
      return {
        ...prevSemesterScores,
        [selectedSemester]: updatedScores,
      };
    });
  };

  const handleAddNewInput = (type) => {
    setSemesterScores((prevSemesterScores) => {
      const updatedScores = { ...prevSemesterScores[selectedSemester] };
      if (type !== 'diemCuoiKi') {
        updatedScores[type].push('');
      }
      return {
        ...prevSemesterScores,
        [selectedSemester]: updatedScores,
      };
    });
  };

  const mutation = useMutation({
    mutationFn: async (newAbsentStudents) => {
      // Call the ScheduleService để gửi dữ liệu cập nhật absent students
      return ScheduleService.updateAbsentstudentId(idSchedule, idClass, idSlot, newAbsentStudents);
    },
    onSuccess: (data) => {
      // Display success toast và log dữ liệu đã cập nhật
      toast.success("Absent students updated successfully!");
      console.log("Absent students updated:", data);
    },
    onError: (error) => {
      // Hiển thị lỗi nếu có
      toast.error("Error updating absent students.");
      console.error("Error updating absent students:", error.message);
    },
  });

  const saveStudents = () => {
    const newAbsentStudents = students
      .filter(student => student.status === false) // Lọc học sinh vắng mặt
      .map(student => ({
        studentId: student._id, // Sử dụng studentId thay vì id
        isExcused: absenceTypes[student._id] === 'Excused' // Đặt isExcused dựa trên absenceTypes
      }));

    console.log("Inactive Student IDs with Absence Type:", newAbsentStudents);

    // Đảm bảo inactiveStudentIds là mảng
    if (!Array.isArray(newAbsentStudents)) {
      console.error("newAbsentStudents is not an array:", newAbsentStudents);
      return;
    }

    // Gọi mutation để cập nhật danh sách học sinh vắng
    mutation.mutate(newAbsentStudents);
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

  return (
    <div className="flex flex-col w-full h-screen bg-white w-[95%] mx-auto pb-4">
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
                  {!isSubjectPhu(idSubject, detailClass?.subjectGroup.SubjectsPhuId) && <th style={{ width: "15%" }} className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-white uppercase tracking-wider">Xem</th>}

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
                    {!isSubjectPhu(idSubject, detailClass?.subjectGroup.SubjectsPhuId) &&
                      <td className="px-6 py-4 whitespace-nowrap">
                        <GrView
                          className="cursor-pointer"
                          onClick={() => openModal(student)}
                          title="Xem chi tiết"
                        />
                      </td>
                    }
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-1/4 h-full flex flex-col overflow-auto mr-4">
          <AbsenceRequestList idClass={idClass} year={year} week={week} dayOfWeek={dayOfWeek}
            targetSlot={targetSlot} />
        </div>
      </div>
      {showModal && studentScores && (
        <Modal show={showModal} onHide={closeModal} size="xl">
          <Modal.Body>
            <div className="bg-gray-100 flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">Bảng Điểm Học Sinh</h2>
                <div className="flex justify-center mb-4">
                  <button
                    className={`px-4 py-2 font-semibold ${selectedSemester === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedSemester(1)}
                  >
                    Kỳ 1
                  </button>
                  <button
                    className={`px-4 py-2 font-semibold ${selectedSemester === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedSemester(2)}
                  >
                    Kỳ 2
                  </button>
                </div>
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2" style={{ width: '25%' }}>Tên học sinh</th>
                      <th className="border px-4 py-2 cursor-pointer" style={{ width: '30%' }} onClick={() => handleAddNewInput('diemThuongXuyen')}>
                        Điểm thường xuyên
                      </th>
                      <th className="border px-4 py-2" style={{ width: '15%' }}>
                        Điểm giữa kì
                      </th>
                      <th className="border px-4 py-2" style={{ width: '15%' }}>Điểm cuối kì</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSemester === 1 ? (
                      <tr>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            name="name"
                            value={studentScores.name}
                            readOnly
                            className="w-full border rounded px-2 py-1 bg-gray-100"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <div className="grid grid-cols-2 gap-2">
                            {[...Array(detailSubject?.nameSubject === "Toán" ? 4 : 3)].map((_, index) => (
                              <input
                                key={index}
                                type="number"
                                value={studentScores.scores.diemThuongXuyen?.[index] || ""}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (value < 0) value = 0;
                                  if (value > 10) value = 10;
                                  handleScoreChange('diemThuongXuyen', index, value);
                                }}
                                className="w-full border rounded px-2 py-1"
                                min="0"
                                max="10"
                              />
                            ))}
                          </div>
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="number"
                            value={studentScores.scores.diemGiuaKi || ''}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value < 0) value = 0;
                              if (value > 10) value = 10;
                              handleScoreChange('diemGiuaKi', null, value);
                            }}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="number"
                            value={studentScores.scores.diemCuoiKi || ''}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value < 0) value = 0;
                              if (value > 10) value = 10;
                              handleScoreChange('diemCuoiKi', null, value);
                            }}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            name="name"
                            value={studentScores.name}
                            readOnly
                            className="w-full border rounded px-2 py-1 bg-gray-100"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <div className="grid grid-cols-2 gap-2">
                            {studentScores.scores.diemThuongXuyen?.map((score, index) => (
                              <input
                                key={index}
                                type="number"
                                value={score}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (value < 0) value = 0;
                                  if (value > 10) value = 10;
                                  handleScoreChange('diemThuongXuyen', index, value);
                                }}
                                className="w-full border rounded px-2 py-1"
                              />
                            ))}
                          </div>
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="number"
                            value={studentScores.scores.diemGiuaKi || ''}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value < 0) value = 0;
                              if (value > 10) value = 10;
                              handleScoreChange('diemGiuaKi', null, value);
                            }}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="number"
                            value={studentScores.scores.diemCuoiKi || ''}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value < 0) value = 0;
                              if (value > 10) value = 10;
                              handleScoreChange('diemCuoiKi', null, value);
                            }}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Tắt
            </Button>

            <Button
              variant="primary"
              onClick={async () => {
                const scoreData = {
                  scores: [
                    ...studentScores.scores.diemThuongXuyen.map(score => ({ type: 'thuongXuyen', score, semester: selectedSemester })),
                    
                    studentScores.scores.diemGiuaKi ? { type: 'giuaKi', score: studentScores.scores.diemGiuaKi, semester: selectedSemester } : null,
                    studentScores.scores.diemCuoiKi ? { type: 'cuoiKi', score: studentScores.scores.diemCuoiKi, semester: selectedSemester } : null,
                  ].filter(scoreItem => scoreItem && scoreItem.score !== ''), // Ensure scores are valid
                  studentId: studentScores.id,
                  subjectId: idSubject,
                  classId: idClass,
                };
                console.log(scoreData)
                const currentScoreId = studentScores.scoreIds[selectedSemester];

                try {
                  let response;
                  if (currentScoreId) {
                    response = await ScoreSbujectService.updateScore(currentScoreId, scoreData);
                    toast.success("Đã cập nhật điểm thành công!");
                  } else {
                    response = await ScoreSbujectService.createScore(scoreData);
                    toast.success("Đã khởi tạo điểm thành công!");
                  }

                  // Update scoreId for the semester
                  setStudentScores((prev) => ({
                    ...prev,
                    scoreIds: {
                      ...prev.scoreIds,
                      [selectedSemester]: response._id, // Assuming response contains the new scoreId
                    },
                  }));

                  // Update semesterScores with saved data
                  setSemesterScores((prevSemesterScores) => ({
                    ...prevSemesterScores,
                    [selectedSemester]: studentScores.scores,
                  }));

                  closeModal();
                } catch (error) {
                  console.error("Error handling score:", error);
                }
              }}
            >
              Lưu
            </Button>

          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default StudentTable;
