import axios from "axios";

export const createHistoryPayos = async (historypayosData) => {
  try {
    const res = await axios.post(
      "http://localhost:3001/api/historypayos/createHistoryPayos",
      historypayosData
    );
    return res.data;
  } catch (error) {
    console.error("Error creating history assignment:", error);
    throw error;
  }
};

// export const getDetailHistory = async (id) => {
//   const res = await axios.get(
//     `http://localhost:3001/api/history/detailsHistory/${id}`
//   );
//   return res.data;
// };

export const getAllHistoryPayOs = async () => {
  const res = await axios.get(
    `http://localhost:3001/api/historypayos/getAllHistoryPayOs/`
  );
  return res.data;
};
