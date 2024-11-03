import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaChalkboardTeacher, FaBook, FaDoorOpen, FaClock } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import * as ScheduleService from "../../services/ScheduleService";

const InfoSlot = () => {
    const handleBack = () => {
        window.history.back();
    };
    const {  idSchedule, idSlot} = useParams();
    const [data, setData] = useState(null);
    const [schedule, setSchdule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await ScheduleService.getDetailSlotById(idSchedule, idSlot);
                const schedule = result.data.schedule.dayOfWeek;
                const slotData = result.data.schedule.slots.find(slot => slot._id === idSlot);
                setData(slotData);
                setSchdule(schedule)
                setLoading(false);
            } catch (error) {
                setError("Failed to load slot details");
                setLoading(false);
            }
        };
        fetchData();
    }, [idSchedule, idSlot]);
    console.log("123123",data)
    console.log("123123asd3",schedule)

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
            <button
                onClick={handleBack}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition duration-300 flex items-center text-lg"
            >
                <FaArrowLeft className="mr-2" />
                Trở về
            </button>
            <div className="bg-white w-2/3 shadow-lg rounded-lg p-12 relative">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">Thông tin tiết học</h3>

                <div className="grid grid-cols-2 gap-y-8 gap-x-6 text-xl">
                    <div className="flex items-center gap-3 text-gray-600">
                        <FaCalendarAlt className="text-blue-500" />
                        <p className="font-semibold m-0">Ngày:</p>
                    </div>
                    <p className="text-gray-800 m-0">{schedule}</p>

                    <div className="flex items-center gap-3 text-gray-600">
                        <FaClock className="text-indigo-500" />
                        <p className="font-semibold m-0">Tiết:</p>
                    </div>
                    <p className="text-gray-800 m-0">{data.slotNumber}</p>

                    <div className="flex items-center gap-3 text-gray-600">
                        <FaBook className="text-green-500" />
                        <p className="font-semibold m-0">Môn học:</p>
                    </div>
                    <p className="text-gray-800 m-0">{data.subjectId.nameSubject}</p>

                    <div className="flex items-center gap-3 text-gray-600">
                        <FaChalkboardTeacher className="text-purple-500" />
                        <p className="font-semibold m-0">Giáo viên:</p>
                    </div>
                    <p className="text-gray-800 m-0">{data.subjectId.teacherId.name}</p>

                    <div className="flex items-center gap-3 text-gray-600">
                        <FaDoorOpen className="text-red-500" />
                        <p className="font-semibold m-0">Phòng:</p>
                    </div>
                    <p className="text-gray-800 m-0">{data.classId.nameClass}</p>

                    <div className="flex items-center gap-3 text-gray-600">
                        <FaClock className="text-indigo-500" />
                        <p className="font-semibold m-0">Thời gian:</p>
                    </div>
                    <p className="text-gray-800 m-0">{data.slotNumber} - {data.slotNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default InfoSlot;
