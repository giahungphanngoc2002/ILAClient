import axios from 'axios';

export const getAllBlocks = async () => {
    const res = await axios.get(`http://localhost:3001/api/block/getAllBlocks`)
    return res.data
}