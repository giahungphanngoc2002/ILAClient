import axios from "axios"

export const createClass = async(data) =>{
    const res =await axios.post (`http://localhost:3001/api/class/createClass`,data)
    return res.data
}


export const updateClass = async(id ,data) =>{
    const res =await axios.put (`http://localhost:3001/api/class/updateClass/${id}`,data)
    return res.data
}

export const getDetailClass = async(id) =>{
    const res =await axios.get (`http://localhost:3001/api/class/detailsClass/${id}`)
    return res.data
}

export const getAllClass = async() =>{
    const res =await axios.get (`http://localhost:3001/api/class/getAllClass`)
    return res.data
}
