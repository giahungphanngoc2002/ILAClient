import axios from "axios"

export const createClass = async(data) =>{
    const res =await axios.post (`http://localhost:3001/api/class/createClass`,data)
    return res.data
}


export const updateClass = async(id ,data) =>{
    const res =await axios.put (`http://localhost:3001/api/class/updateClass/${id}`,data)
    return res.data
}

export const deleteClassByID = async(id) =>{
    const res =await axios.delete (`http://localhost:3001/api/class/deleteClass/${id}`)
    return res.data
}

export const getDetailClass = async(id) =>{
    const res =await axios.get (`http://localhost:3001/api/class/detailsClass/${id}`)
    return res.data;
}

export const getAllClass = async() =>{
    const res =await axios.get (`http://localhost:3001/api/class/getAllClass`)
    return res.data
}


export const addClassHistory = async(classId, historyData) => {
    const res = await axios.post(`http://localhost:3001/api/class/class/${classId}/history`, historyData);
    return res.data;
}

export const getAllTopClass = async() =>{
    const res =await axios.get (`http://localhost:3001/api/class/top`)
    return res.data
}

export const getCountClass = async() =>{
    const res =await axios.get (`http://localhost:3001/api/class/countClass`)
    return res.data
}

export const deleteQuestionById = async (classId, questionId) => {
    const res = await axios.delete(`http://localhost:3001/api/class/class/${classId}/questions/${questionId}`);
    return res.data;
};

export const updateQuestionById = async (classId, questionId,updatedQuestion) => {
    const res = await axios.put(`http://localhost:3001/api/class/class/${classId}/questions/${questionId}`,updatedQuestion);
    return res.data;
};

export const getHistoryClass = async (classId) => {
    const res = await axios.get(`http://localhost:3001/api/class/class/${classId}/history`);
    return res.data;
};

export const addQuestionById = async (classId, newQuestions) => {
    const res = await axios.post(`http://localhost:3001/api/class/class/${classId}/questions`,newQuestions);
    return res.data;
};
export const addTest = async(classId, testData) => {
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