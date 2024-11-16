import axios from "axios"

export const createClass = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/class/createClass`, data)
    return res.data
}

export const updateClass = async (id, data) => {
    const res = await axios.put(`http://localhost:3001/api/class/updateClass/${id}`, data)
    return res.data
}

export const deleteClassByID = async (id) => {
    const res = await axios.delete(`http://localhost:3001/api/class/deleteClass/${id}`)
    return res.data
}

export const getDetailClass = async (id) => {
    const res = await axios.get(`http://localhost:3001/api/class/detailsClass/${id}`)
    return res.data;
}

export const getAllClass = async () => {
    const res = await axios.get(`http://localhost:3001/api/class/getAllClass`)
    return res.data
}

export const addClassHistory = async (classId, historyData) => {
    const res = await axios.post(`http://localhost:3001/api/class/class/${classId}/history`, historyData);
    return res.data;
}

export const getAllTopClass = async () => {
    const res = await axios.get(`http://localhost:3001/api/class/top`)
    return res.data
}

export const getCountClass = async () => {
    const res = await axios.get(`http://localhost:3001/api/class/countClass`)
    return res.data
}

export const deleteQuestionById = async (classId, questionId) => {
    const res = await axios.delete(`http://localhost:3001/api/class/class/${classId}/questions/${questionId}`);
    return res.data;
};

export const updateQuestionById = async (classId, questionId, updatedQuestion) => {
    const res = await axios.put(`http://localhost:3001/api/class/class/${classId}/questions/${questionId}`, updatedQuestion);
    return res.data;
};

export const getHistoryClass = async (classId) => {
    const res = await axios.get(`http://localhost:3001/api/class/class/${classId}/history`);
    return res.data;
};

export const addQuestionById = async (classId, newQuestions) => {
    const res = await axios.post(`http://localhost:3001/api/class/class/${classId}/questions`, newQuestions);
    return res.data;
};
export const addTest = async (classId, testData) => {
    const res = await axios.post(`http://localhost:3001/api/class/class/${classId}/test`, testData);
    return res.data;
}
export const addStudentIDToClass = async (classId, email) => {
    const res = await axios.post(`http://localhost:3001/api/class/class/${classId}/studentID`, { email });
    return res.data;
};

export const deleteStudentIDToClass = async (classId, studentId) => {
    const res = await axios.delete(`http://localhost:3001/api/class/class/${classId}/studentID`, {
        data: { studentId }
    });
    return res.data;
};

export const getStudentInClass = async (classId, classData) => {
    const res = await axios.get(`http://localhost:3001/api/class/class/${classId}/students`, classData);
    return res.data;
}

export const getAllScheduleForTeacherId = async (teacherId) => {
    const res = await axios.get(`http://localhost:3001/api/class/teacher/${teacherId}/schedules`);
    return res.data;
};

export const getAllSubjectClassesByTeacherId = async (teacherId) => {
    const res = await axios.get(`http://localhost:3001/api/class/teacher/${teacherId}/classes/subjects`);
    return res.data;
};

export const updateSubjectInClass = async (classId, subjectId, updateData) => {
    const res = await axios.put(`http://localhost:3001/api/class/${classId}/subject/${subjectId}`, updateData);
   return res.data;
      
     };
export const getResourcesBySubject = async (classId, subjectId) => {
       const res = await axios.get(`http://localhost:3001/api/class/${classId}/subjects/${subjectId}/resources`);
       return res.data;
};

export const addResourceToSubject = async (classId, subjectId, linkResource) => {
      const res = await axios.post(`http://localhost:3001/api/class/${classId}/subjects/${subjectId}/resources`, {
        linkResource
      });
      return res.data;
    
  };
  
  export const getDetailClassByTeacherHR = async (teacherId) => {
    const res = await axios.get(`http://localhost:3001/api/class/classes/teacher/${teacherId}`);
    return res.data;
};
export const getAllStudentsByTeacherHR = async (teacherId) => {
    const res = await axios.get(`http://localhost:3001/api/class/students/teacher/${teacherId}`);
    return res.data;
};

export const createApplication = async (classId, applicationData) => {
    const res = await axios.post(`http://localhost:3001/api/class/classes/${classId}/applicationabsent`, applicationData);
    return res.data;  
};

export const getDetailApplicationAbsentByIdClass = async (classId) => {
    const res = await axios.get(`http://localhost:3001/api/class/classes/${classId}/applicationabsent`);
    return res.data; 
};

export const createConduct = async (classId, conductData) => {  
      const res = await axios.post(`http://localhost:3001/api/class/classes/${classId}/createConDuct`, conductData);
      return res.data; 
    
  };

  export const getAllConductSemester = async (classId, semester) => {
    
      const res = await axios.get(`http://localhost:3001/api/class/getAllConduct/${classId}/${semester}`);
      return res.data; 
   
  };

  export const updateConduct = async (classId, conductId, semester, updateData) => {
      const res = await axios.put(`http://localhost:3001/api/class/updateConduct/${classId}/${conductId}/${semester}`, updateData);
      return res.data; 
   
  };
   
