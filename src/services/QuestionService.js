import axios from "axios"

export const createQuestion = async(parsedAnswer) =>{
    const res =await axios.post (`http://localhost:3001/api/question/createQuestion`,parsedAnswer)
    return res.parsedAnswer
}

// export const getAllQuestion = async(parsedAnswer) =>{
//     const res =await axios.get (`http://localhost:3001/api/question/getAllQuestion`,parsedAnswer)
//     return res.parsedAnswer
// }

