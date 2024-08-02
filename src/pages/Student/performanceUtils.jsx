export const getPerformanceStatus = (score) => {
    if (score >= 7) {
      return "Good";
    } else if (score >= 5) {
      return "Khá";
    } else {
      return "Low";
    }
  };
  
  export const getPerformanceStatusClassName = (score) => {
    if (score >= 7) {
      return "text-green-500 text-green-50 py-2.5 px-3.5"; // Màu xanh lá
    } else if (score >= 5) {
      return "text-blue-500 text-green-50 py-2.5 px-3.5"; // Màu xanh dương
    } else {
      return "text-red-500 text-green-50 py-2.5 px-3.5"; // Màu đỏ
    }
  };