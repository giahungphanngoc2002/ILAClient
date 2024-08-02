import React, { useEffect, useState } from "react";
import * as ClassService from "../../services/ClassService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { CiSaveDown2 } from "react-icons/ci";
import { FaUserGroup } from "react-icons/fa6";
import { GrFormView } from "react-icons/gr";
import { MdOutlineSportsScore } from "react-icons/md";
import Chart from "react-apexcharts";
import {
  getPerformanceStatus,
  getPerformanceStatusClassName,
} from "../Student/performanceUtils"; // Đường dẫn đến performanceUtils
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ExcelJS from "exceljs"; // Thêm thư viện ExcelJS

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HistoryStudent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const user = useSelector((state) => state.user);
  const [iDStudent, setIDStudent] = useState("");
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIDStudent(user?.id);
  }, [user?.id]);
  
  console.log("12312",iDStudent)

  const getAllClass = async () => {
    const res = await ClassService.getAllClass();
    return res;
  };

  const {
    data: allclass,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allclass"],
    queryFn: getAllClass,
  });

  useEffect(() => {
    if (allclass && allclass?.data.tests) {
      setTests(allclass?.data.tests);
    }
  }, [allclass]);

  const filteredHistory = allclass?.data
    .flatMap((item) => {
      const historyIDs =
        item.historyID && item.historyID.length > 0 ? item.historyID : [];
      const historyTests = item.tests
        ? item.tests.flatMap((test) =>
            test.historyTest
              ? test.historyTest.map((ht) => ({
                  ...ht,
                  isAssignment: true,
                  iDTest: test.iDTest,
                  iDClass: item.classID,
                }))
              : []
          )
        : [];
      return [...historyIDs, ...historyTests];
    })
    .filter(
      (history, index, self) =>
        history?.studentID?._id === iDStudent &&
        self.findIndex((h) => h._id === history._id) === index
    )
    .sort((a, b) => b.createdAt - a.createdAt); // Sắp xếp theo điểm từ cao đến thấp

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Student History");

    // Định nghĩa cấu trúc của bảng
    worksheet.columns = [
      { header: "ID", key: "studentID" },
      { header: "Name", key: "name" },
      { header: "Phone", key: "phone" },
      { header: "Email", key: "email" },
      { header: "Class Name", key: "className" },
      { header: "Class ID", key: "classID" },
      { header: "Date Complete", key: "dateComplete" },
      { header: "Score", key: "score" },
    ];

    // Thêm dữ liệu vào từng hàng của bảng
    filteredHistory.forEach((history) => {
      worksheet.addRow({
        studentID: history.studentID._id,
        name: history.studentID.name,
        phone: history.studentID.phone,
        email: history.studentID.email,
        className: history.classID?.nameClass || history.iDTest,
        classID: history.classID?.classID || history.iDClass,
        dateComplete: new Date(history.createdAt).toLocaleDateString(),
        score: history.point,
      });
    });

    // Xuất file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_history.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading classes.</div>;
  }

  const handleReview = (id) => {
    navigate(`/detailHistory/${id}`);
  };
  const handleReviewAssigment = (id) => {
    navigate(`/detailAssigment/${id}`);
  };

  let startIndex = 1;
  let count = 0;
  let totalScore = 0;
  let totalCompleted = 0;
  const studentHistories = [];
  const getPerformanceStatusClassName = (score) => {
    if (score >= 7) {
      return "text-green-500"; // Màu xanh lá
    } else if (score >= 5) {
      return "text-blue-500"; // Màu xanh dương
    } else {
      return "text-red-500"; // Màu đỏ
    }
  };

  allclass.data.forEach((history) => {
    history.historyID.forEach((historii) => {
      if (historii.studentID._id === iDStudent) {
        totalScore += Number(historii.point);
        totalCompleted++;
        studentHistories.push(historii);
      }
    });
  });

  const averageScore = totalCompleted > 0 ? totalScore / totalCompleted : 0;

  // Total Classes Completed
  const chartoptions = {
    chart: {
      id: "apexchartsarea-datetime",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    colors: ["#8b5cf6"], // Tailwind CSS red-500 color
  };

  const chartSeries = [
    {
      name: "Sent",
      data: [
        { x: new Date(2024, 6, 1), y: 57.94 },
        { x: new Date(2024, 6, 2), y: 44.57 },
        { x: new Date(2024, 6, 3), y: 66.85 },
        { x: new Date(2024, 6, 4), y: 78 },
        { x: new Date(2024, 6, 5), y: 64.62 },
        { x: new Date(2024, 6, 6), y: 22.28 },
        { x: new Date(2024, 6, 7), y: 35.65 },
        { x: new Date(2024, 6, 8), y: 31.19 },
        { x: new Date(2024, 6, 9), y: 15.59 },
        { x: new Date(2024, 6, 10), y: 4.45 },
        { x: new Date(2024, 6, 11), y: 13.37 },
        { x: new Date(2024, 6, 12), y: 28.97 },
{ x: new Date(2024, 6, 13), y: 40.11 },
      ],
    },
  ];

  // Average Score
  const chartAverage = {
    chart: {
      id: "apexchartsarea-datetime",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    colors: ["#34d399"], // Tailwind CSS blue-500 color
  };

  const chartSeriesAverage = [
    {
      name: "Sent",
      data: [
        { x: new Date(2024, 6, 1), y: 57.94 },
        { x: new Date(2024, 6, 2), y: 44.57 },
        { x: new Date(2024, 6, 3), y: 66.85 },
        { x: new Date(2024, 6, 4), y: 78 },
        { x: new Date(2024, 6, 5), y: 64.62 },
        { x: new Date(2024, 6, 6), y: 22.28 },
        { x: new Date(2024, 6, 7), y: 35.65 },
        { x: new Date(2024, 6, 8), y: 31.19 },
        { x: new Date(2024, 6, 9), y: 15.59 },
        { x: new Date(2024, 6, 10), y: 4.45 },
        { x: new Date(2024, 6, 11), y: 13.37 },
        { x: new Date(2024, 6, 12), y: 28.97 },
        { x: new Date(2024, 6, 13), y: 40.11 },
      ],
    },
  ];

  const chartData = {
    labels: filteredHistory.map((historii) =>
      new Date(historii.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Scores < 5",
        data: filteredHistory.map((historii) =>
          historii.point < 5 ? historii.point : null
        ),
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 3,
        pointStyle: "rectRot",
        pointRadius: 7,
        pointHoverRadius: 10,
      },
      {
        label: "Scores 5-7",
        data: filteredHistory.map((historii) =>
          historii.point >= 5 && historii.point <= 7 ? historii.point : null
        ),
        fill: false,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 3,
        pointStyle: "triangle",
        pointRadius: 7,
        pointHoverRadius: 10,
      },
      {
        label: "Scores > 7",
        data: filteredHistory.map((historii) =>
          historii.point > 7 ? historii.point : null
        ),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 3,
        pointStyle: "circle",
        pointRadius: 7,
        pointHoverRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Student Score History",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Score",
        },
      },
    },
    elements: {
      line: {
        tension: 0.5, // Điều chỉnh độ cong của đường nét
      },
    },
spanGaps: true, // Bỏ qua các khoảng trống trong dữ liệu
  };

  console.log(filteredHistory)

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-400">Dashboards</h2>
      <div className="flex mb-6">
        <div className="grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-50 h-30">
          <div className="bg-purple-100 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium  mb-2 flex items-center justify-center text-slate-500">
              <FaUserGroup
                className="mr-2 border bg-purple-400 text-white rounded-md p-2"
                size={50}
              />
              Total Classes Completed
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {totalCompleted}
            </p>
            <p className="text-sm text-gray-500">Monthly Data</p>
            <div
              id="total-classes-completed-chart"
              className="mt-4"
              style={{ height: "150px" }}
            >
              <Chart
                options={chartoptions}
                series={chartSeries}
                type="line"
                height="150"
              />
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium  mb-2 flex items-center justify-center text-slate-500">
              <MdOutlineSportsScore
                className="mr-2 border bg-green-400 text-white rounded-md p-2"
                size={50}
              />
              Average Score
            </h3>

            <p className="text-3xl font-bold text-gray-900 mb-2">
              {averageScore.toFixed(2)}%
            </p>
            <p className="text-sm text-gray-500">Monthly Data</p>
            <div
              id="average-score-chart"
              className="mt-4"
              style={{ height: "150px" }}
            >
              <Chart
                options={chartAverage}
                series={chartSeriesAverage}
                type="line"
                height="150"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          <label htmlFor="entriesPerPage" className="mr-2">
            Entries per page:
          </label>
          <select
            id="entriesPerPage"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex justify-between items-center mb-4">
<input
            type="text"
            className="p-2 border border-gray-300 rounded"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center">
            <button
              onClick={handleExport}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Export <CiSaveDown2 className="inline-block ml-1" />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded">
        <table className="min-w-full  border border-gray-300">
          <thead>
            <tr className="bg-blue-300">
              
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Class Name</th>
              <th className="py-2 px-4 border-b">Class ID</th>
              <th className="py-2 px-4 border-b">Date Complete</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Score</th>
              <th className="py-2 px-4 border-b">Performance</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.filter(
  (history) =>
   
    (history.classID?.nameClass?.toLowerCase().includes(searchTerm.toLowerCase()) || history.iDTest?.toLowerCase().includes(searchTerm.toLowerCase()))
)
              .slice(0, entriesPerPage)
              .map((history, index) => {
                const dateComplete = new Date(
                  history.createdAt
                ).toLocaleDateString();
                const performanceStatus = getPerformanceStatus(history.point);
                const performanceClassName = getPerformanceStatusClassName(
                  history.point
                );
                return (
                  <tr key={history._id}>
                    
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm leading-5 font-medium text-gray-900">
                            {history.studentID.name}
                          </div>
                      <div className="text-sm leading-5 text-gray-500">
                            {history.studentID.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {history.classID?.nameClass || history.iDTest}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {history.classID?.classID || history.iDClass}
                    </td>
                    <td className="py-2 px-4 border-b">{dateComplete}</td>
                    
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5">
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <button
                          className="px-2 text-black bg-green-100 border-green-500 border font-medium text-xs py-0.5 rounded inline-block"
                          onClick={() =>
                            history.classID?.nameClass
                              ? handleReview(history.id)
                              : handleReviewAssigment(history.id)
                          }
                          disabled
                        >
                          Đã hoàn thành
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
  {!history.isAssignment ? (
    <span className="bg-red-500 border border-red-500 px-2 py-1 rounded text-white">Learning</span>
  ) : (
    <span className="bg-green-500 border border-green-500 px-2 py-1 rounded text-white">Assignment</span>
  )}
</td>

                    <td className="py-2 px-4 border-b">{history.point}</td>
                    <td
                      className={`py-2 px-4 border-b ${performanceClassName}`}
                    >
                      {performanceStatus}
                    </td>

                    {/* <td className="py-2 px-4 border-b">
                      <button
                        onClick={() =>
                          history.classID?.nameClass
                            ? handleReview(history.id)
                            : handleReviewAssigment(history.id)
                        }
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        <GrFormView />
                      </button>
                    </td> */}
                    <td className="border-b-2 p-2">
                      {history.isAssignment ? (
                        <button
                          onClick={() => handleReviewAssigment(history._id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                           <GrFormView />
                          
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReview(history._id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <GrFormView />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryStudent;