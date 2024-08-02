import axios from "axios";

export const getDetailHistoryTest = async (id) => {
    const res = await axios.get(
      `http://localhost:3001/api/test/detailsHistoryTest/${id}`
    );
    return res.data;
  };