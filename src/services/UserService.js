import axios from "axios"

export const axiosJWT =axios.create()

export const loginUser = async(data) =>{
    const res =await axios.post (`http://localhost:3001/api/user/signin`,data)
    return res.data
}

export const signupUser = async(data) =>{
    const res =await axios.post (`http://localhost:3001/api/user/signup`,data)
    return res.data
}



export const logoutUser = async(data) =>{
    const res =await axios.get (`http://localhost:3001/api/user/logout`,data)
    return res.data
}

export const getDetailUser = async(id,access_token) =>{
    const res =await axios.get (`http://localhost:3001/api/user/getdetails/${id}`,{
        headers: {
            token : `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const refreshToken = async() =>{
    const res =await axios.post (`http://localhost:3001/api/user/refresh-token`,{
        withCredentials:true
    })
    return res.data
}

export const updateUser = async(id ,data,access_token) =>{
    const res =await axios.put (`http://localhost:3001/api/user/updateUser/${id}`,data,{
        headers: {
            token : `Bearer ${access_token}`,
        }
    })
    return res.data
}

// export const updateClass = async(id ,data1) =>{
//     const res =await axios.put (`http://localhost:3001/api/class/updateClass/${id}`,data1)
//     return res.data
// }

// export const getDetailClass = async(id) =>{
//     const res =await axios.get (`http://localhost:3001/api/class/detailsClass/${id}`)
//     return res.data
// }