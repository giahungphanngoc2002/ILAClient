import React, { useState, useEffect } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { RiStarFill } from "react-icons/ri";
import { HiClipboardList } from 'react-icons/hi';
import * as ClassService from "../../services/ClassService";

const SummaryStudent = ({ studentId, selectedSemester, evaluates, averages, semesters , setAchivement }) => {
    const [conduct, setConduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [conduct1, setConduct1] = useState();
    const [conduct2, setConduct2] = useState();
    const [hocLuc1, setHocLuc1] = useState();
    const [hocLuc2, setHocLuc2] = useState();
    const [dtb1, setDtb1] = useState();
    const [dtb2, setDtb2] = useState();
    const [finalHocLuc, setFinalHocLuc] = useState();
    // const [achievement, setAchivement] = useState()



    const semesterMapping = semesters.reduce((acc, { _id, nameSemester }) => {
        acc[_id] = nameSemester;
        return acc;
    }, {});

    const updatedEvaluates = evaluates.map(evaluate => {
        const nameSemester = semesterMapping[evaluate.semester];
        return { ...evaluate, semester: nameSemester };
    });

    function countNotAchievedSemester1(evalutes) {
        return evalutes.filter(evaluate => evaluate.semester === 1 && evaluate.evaluate !== "Đạt").length;
    }

    function countNotAchievedSemester2(evalutes) {
        return evalutes.filter(evaluate => evaluate.semester === 2 && evaluate.evaluate !== "Đạt").length;
    }

    const notAchievedCountSemester1 = countNotAchievedSemester1(updatedEvaluates);
    const notAchievedCountSemester2 = countNotAchievedSemester2(updatedEvaluates);


    useEffect(() => {
        const fetchConduct = async () => {
            if (!studentId) return;

            setLoading(true);
            setError(null);
            try {
                const data = await ClassService.getConductByStudentIdAndSemester(studentId, selectedSemester);
                setConduct1(data);
            } catch (err) {
                // setError('Không thể tải dữ liệu hạnh kiểm');

            } finally {
                setLoading(false);
            }
        };

        fetchConduct();
    }, [studentId, selectedSemester]);

    useEffect(() => {
        const fetchConduct = async () => {
            if (!studentId) return;

            setLoading(true);
            setError(null);
            try {
                const data = await ClassService.getConductByStudentIdAndSemester(studentId, selectedSemester);
                setConduct2(data);
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };

        fetchConduct();
    }, [studentId, selectedSemester]);


    const calculateTotalAverage = (semester) => {
        if (semester.some(item => item.average === "Chưa có")) {
            return "Chưa có";
        }

        const average = semester.reduce((sum, item) => sum + parseFloat(item.average), 0) / semester.length;

        return average.toFixed(2);
    };

    const classify = (semester, count) => {
        if (semester.some(item => item.average === "Chưa có")) {
            return "Chưa có";
        }

        const above8 = semester.filter(item => item.average >= 8);
        const above6_5 = semester.filter(item => item.average >= 6.5);
        const above5 = semester.filter(item => item.average >= 5);
        const above3_5 = semester.filter(item => item.average >= 3.5);

        if (above8.length >= 6 && above6_5.length >= 10 && count == 0) {
            return "Tốt";
        }

        if (above6_5.length >= 6 && above5.length >= 10 && count == 0) {
            return "Khá";
        }

        if (above5.length >= 6 && above3_5.length >= 3.5 && count == 1) {
            return "Đạt";
        }

        return "Chưa đạt";
    };

    useEffect(() => {
        const semester1 = averages.filter(item => item.semester === "1");
        const semester2 = averages.filter(item => item.semester === "2");

        const resultSemester1 = classify(semester1, notAchievedCountSemester1);
        const resultSemester2 = classify(semester2, notAchievedCountSemester2);

        setHocLuc1(resultSemester1);
        setHocLuc2(resultSemester2);

        setDtb1(calculateTotalAverage(semester1))
        setDtb2(calculateTotalAverage(semester2))

    }, [averages]);

    const calculateFinalDtb = (dtb1, dtb2) => {
        if (dtb1 === "Chưa có" || dtb2 === "Chưa có") {
            return "Chưa có";
        }
        return ((parseFloat(dtb1) + 2 * parseFloat(dtb2)) / 3).toFixed(2);
    };


    useEffect(() => {
        const semester1 = averages.filter(item => item.semester == "1");
        const semester2 = averages.filter(item => item.semester == "2");

        const calculateAverage = (semester1, semester2) => {
            return (parseFloat(semester1) + 2 * parseFloat(semester2)) / 3;
        };

        const result = semester1.map((item1) => {
            const item2 = semester2.find(item => item.subject === item1.subject);
            if (item2) {
                const average = item2.average === "Chưa có" ? "Chưa có" : calculateAverage(item1.average, item2.average).toFixed(2);
                return {
                    subject: item1.subject,
                    average: average
                };
            }
            return null;
        }).filter(item => item !== null);
        const resultFinal = classify(result, notAchievedCountSemester2)
        setFinalHocLuc(resultFinal)
    }, [averages]);

    const checkAchivement = (semester) => {
        if (semester.some(item => item.average === "Chưa có")) {
            return "Chưa có";
        }

        const above9 = semester.filter(item => item.average >= 9.00);
        const above8 = semester.filter(item => item.average >= 8.00);

        if (above9.length >= 6 && above8.length >= 10) {
            return "Học Sinh Xuất sắc";
        }

        return "Học Sinh Giỏi";
    };

    useEffect(() => {
        if (finalHocLuc === "Tốt") {
            const semester1 = averages.filter(item => item.semester == "1");
            const semester2 = averages.filter(item => item.semester == "2");

            const calculateAverage = (semester1, semester2) => {
                return (parseFloat(semester1) + 2 * parseFloat(semester2)) / 3;
            };

            const result = semester1.map((item1) => {
                const item2 = semester2.find(item => item.subject === item1.subject);
                if (item2) {
                    const average = item2.average === "Chưa có" ? "Chưa có" : calculateAverage(item1.average, item2.average).toFixed(2);
                    return {
                        subject: item1.subject,
                        average: average
                    };
                }
                return null;
            }).filter(item => item !== null);
            const achivement = checkAchivement(result)
            setAchivement(achivement)
        }
    }, [finalHocLuc]);

    // console.log(achievement)


    function tinhHanhKiem(hk1, hk2) {
        const mucHanhKiem = ["Yếu", "Trung bình", "Khá", "Tốt"];

        const indexHK1 = mucHanhKiem.indexOf(hk1);
        const indexHK2 = mucHanhKiem.indexOf(hk2);

        // Kiểm tra nếu có hạnh kiểm Yếu
        if (hk1 === "Yếu" || hk2 === "Yếu") {
            return "Yếu"; // Ưu tiên mức thấp nhất nếu có "Yếu"
        }

        // Nếu cả hai kỳ giống nhau
        if (indexHK1 === indexHK2) {
            return hk1;
        }

        // Nếu khác nhau, ưu tiên kỳ 2
        if (indexHK1 > indexHK2) {
            // Kỳ 1 cao hơn kỳ 2 -> hạ xuống mức của kỳ 2
            return hk2;
        } else {
            // Kỳ 1 thấp hơn kỳ 2 -> nâng lên mức giữa kỳ 1 và kỳ 2
            return mucHanhKiem[indexHK1 + 1];
        }
    }

    const data = [
        {
            icon: <FaGraduationCap className="w-6 h-6" />,
            title: "Điểm trung bình",
            score: calculateFinalDtb(dtb1, dtb2), // Giả sử điểm trung bình từ API khác
            details: [
                { label: 'Học kỳ 1', value: dtb1 },
                { label: 'Học kỳ 2', value: dtb2 },
            ],
            bgColor: "bg-green-500"
        },
        {
            icon: <RiStarFill className="w-6 h-6 text-purple-500" />,
            title: "Học lực",
            score: finalHocLuc, // Giả sử học lực từ API khác
            details: [
                { label: 'Học kỳ 1', value: hocLuc1 },
                { label: 'Học kỳ 2', value: hocLuc2 },
            ],
            bgColor: "bg-purple-500"
        },
        {
            icon: <RiStarFill className="w-6 h-6 text-orange-500" />,
            title: "Hạnh kiểm",
            score: tinhHanhKiem(conduct1?.typeConduct, conduct2?.typeConduct) || "Đang tải...",
            details: [
                { label: `Học kỳ 1`, value: conduct1?.typeConduct || "Chưa có" },
                { label: `Học kỳ 2`, value: conduct2?.typeConduct || "Chưa có" }

            ],
            bgColor: "bg-orange-500"
        },
    ];

    return (
        <div className="w-full p-6 flex flex-col">
            <div className="flex items-center mb-6">
                <HiClipboardList className="text-blue-600 w-6 h-6 mr-2" />
                <span className="text-xl font-bold text-blue-600">TỔNG KẾT</span>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-between">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col bg-white rounded-lg p-4 shadow-md w-full md:w-1/3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <div className={`p-2 ${item.bgColor} text-white rounded-full`}>
                                    {item.icon}
                                </div>
                                <span className="font-semibold text-lg">{item.title}</span>
                            </div>
                            <p className="font-semibold text-lg m-0">{item.score}</p>
                        </div>
                        <hr className="my-2" />
                        <div className="space-y-2">
                            {item.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="flex justify-between">
                                    <span>{detail.label}</span>
                                    <span className="font-medium">{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SummaryStudent;
