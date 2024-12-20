import axios from "axios";



const CLASS_API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ila-server-2-3bw0.onrender.com/api/class"
        : "http://localhost:3001/api/class";

// API liên quan đến lớp học
export const createClass = async (data) => {
    const res = await axios.post(`${CLASS_API_URL}/createClass`, data);
    return res.data;
};



export const updateClass = async (id, data) => {
    const res = await axios.put(`${CLASS_API_URL}/updateClass/${id}`, data);
    return res.data;
};

export const deleteClassByID = async (id) => {
    const res = await axios.delete(`${CLASS_API_URL}/deleteClass/${id}`);
    return res.data;
};

export const getDetailClass = async (id) => {
    const res = await axios.get(`${CLASS_API_URL}/detailsClass/${id}`);
    return res.data;
};

export const getAllClass = async () => {
    const res = await axios.get(`${CLASS_API_URL}/getAllClass`);
    return res.data;
};

export const getAllClassType = async () => {
    const res = await axios.get(`${CLASS_API_URL}/getAllClassType`);
    return res.data;
};

export const getAllRoomClass = async () => {
    const res = await axios.get(`${CLASS_API_URL}/getAllRoomClass`);
    return res.data;
};
export const getAllTopClass = async () => {
    const res = await axios.get(`${CLASS_API_URL}/top`);
    return res.data;
};

export const getCountClass = async () => {
    const res = await axios.get(`${CLASS_API_URL}/countClass`);
    return res.data;
};

// API liên quan đến lịch sử lớp học
export const addClassHistory = async (classId, historyData) => {
    const res = await axios.post(`${CLASS_API_URL}/class/${classId}/history`, historyData);
    return res.data;
};

export const getHistoryClass = async (classId) => {
    const res = await axios.get(`${CLASS_API_URL}/class/${classId}/history`);
    return res.data;
};

// API liên quan đến câu hỏi
export const deleteQuestionById = async (classId, questionId) => {
    const res = await axios.delete(`${CLASS_API_URL}/class/${classId}/questions/${questionId}`);
    return res.data;
};

export const updateQuestionById = async (classId, questionId, updatedQuestion) => {
    const res = await axios.put(`${CLASS_API_URL}/class/${classId}/questions/${questionId}`, updatedQuestion);
    return res.data;
};

export const addQuestionById = async (classId, newQuestions) => {
    const res = await axios.post(`${CLASS_API_URL}/class/${classId}/questions`, newQuestions);
    return res.data;
};

// API liên quan đến bài kiểm tra
export const addTest = async (classId, testData) => {
    const res = await axios.post(`${CLASS_API_URL}/class/${classId}/test`, testData);
    return res.data;
};

// API liên quan đến sinh viên
export const addStudentIDToClass = async (classId, username) => {
    const res = await axios.post(`${CLASS_API_URL}/class/${classId}/studentID`, { username });
    return res.data;
};

export const addStudentIDToClassbyId = async (classId, studentIds) => {
    const res = await axios.post(`${CLASS_API_URL}/class/${classId}/studentIDs`, { studentIds });
    return res.data;
};

export const deleteStudentIDToClass = async (classId, studentId) => {
    const res = await axios.delete(`${CLASS_API_URL}/class/${classId}/studentID`, {
        data: { studentId },
    });
    return res.data;
};

export const transferStudent = async (studentId, fromClassId, toClassId) => {
    const res = await axios.post(`${CLASS_API_URL}/transferstudent`, {
        studentId,
        fromClassId,
        toClassId,
    });
    return res.data;
};

export const getStudentInClass = async (classId, classData) => {
    const res = await axios.get(`${CLASS_API_URL}/class/${classId}/students`, classData);
    return res.data;
};

// API liên quan đến giáo viên
export const getAllScheduleForTeacherId = async (teacherId) => {
    const res = await axios.get(`${CLASS_API_URL}/teacher/${teacherId}/schedules`);
    return res.data;
};

export const getAllSubjectClassesByTeacherId = async (teacherId) => {
    const res = await axios.get(`${CLASS_API_URL}/teacher/${teacherId}/classes/subjects`);
    return res.data;
};

export const getDetailClassByTeacherHR = async (teacherId) => {
    const res = await axios.get(`${CLASS_API_URL}/classes/teacher/${teacherId}`);
    return res.data;
};

export const getAllStudentsByTeacherHR = async (teacherId) => {
    const res = await axios.get(`${CLASS_API_URL}/students/teacher/${teacherId}`);
    return res.data;
};

// API liên quan đến môn học và tài nguyên
export const updateSubjectInClass = async (classId, subjectId, updateData) => {
    const res = await axios.put(`${CLASS_API_URL}/${classId}/subject/${subjectId}`, updateData);
    return res.data;
};

export const getResourcesBySubject = async (classId, subjectId) => {
    const res = await axios.get(`${CLASS_API_URL}/${classId}/subjects/${subjectId}/resources`);
    return res.data;
};

export const addResourceToSubject = async (classId, subjectId, file, content) => {
    // Tạo FormData để chứa file
    const formData = new FormData();
    formData.append("linkResource", file);
    formData.append("content", content); // 'linkResource' là tên trường trong multer

    try {
        const res = await axios.post(
            `${CLASS_API_URL}/${classId}/subjects/${subjectId}/resources`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Quan trọng khi gửi FormData
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error uploading resource:', error);
        throw error;
    }
};

export const deleteResourceToSubject = async (classId, subjectId, fileId) => {
    const res = await axios.delete(`${CLASS_API_URL}/${classId}/subjects/${subjectId}/resources/${fileId}`);
    return res.data;
};

export const downloadFileFromCloudinary = async (fileId) => {
    const res = await axios.get(`${CLASS_API_URL}/download/${fileId}`, {
        responseType: "blob", // Đảm bảo nhận file nhị phân
    });
    return res; // Trả về toàn bộ response
};



// API liên quan đến đơn xin vắng mặt
export const createApplication = async (classId, applicationData) => {
    const res = await axios.post(`${CLASS_API_URL}/classes/${classId}/applicationabsent`, applicationData);
    return res.data;
};

export const createApplicationByParent = async (classId, studentId, applicationData) => {
    const res = await axios.post(`${CLASS_API_URL}/classes/${classId}/${studentId}/applicationabsent`, applicationData);
    return res.data;
};

export const getDetailApplicationAbsentByIdClass = async (classId) => {
    const res = await axios.get(`${CLASS_API_URL}/classes/${classId}/applicationabsent`);
    return res.data;
};

export const getAllApplicationByStatus = async (classId) => {
    const res = await axios.get(`${CLASS_API_URL}/applications/status/${classId}`);
    return res.data;
};
export const getDetailApplicationAbsent = async (id) => {
    const res = await axios.get(`${CLASS_API_URL}/applications/${id}`);
    return res.data;
};

export const deleteApplication = async (id) => {
    const res = await axios.delete(`${CLASS_API_URL}/deleteapplications/${id}`);
    return res.data;
};

export const updateApplication = async (id) => {
    const res = await axios.put(`${CLASS_API_URL}/updateapplications/${id}`);
    return res.data;
};

// API liên quan đến hạnh kiểm
export const createConduct = async (classId, conductData) => {
    const res = await axios.post(`${CLASS_API_URL}/classes/${classId}/createConDuct`, conductData);
    return res.data;
};

export const getAllConductSemester = async (classId, semester) => {
    const res = await axios.get(`${CLASS_API_URL}/getAllConduct/${classId}/${semester}`);
    return res.data;
};

export const updateConductBySemester = async (classId, conductId, semester, updateData) => {
    const res = await axios.put(`${CLASS_API_URL}/updateConduct/${classId}/${conductId}/${semester}`, updateData);
    return res.data;
};

export const getConductByStudentIdAndSemester = async (studentId, semester) => {
    const res = await axios.get(`${CLASS_API_URL}/conduct/${studentId}/${semester}`);
    return res.data;
};

export const getAllClassByBlock = async (blockId) => {
    const res = await axios.get(`${CLASS_API_URL}/getAllClassByBlock/${blockId}`);
    return res.data;
};