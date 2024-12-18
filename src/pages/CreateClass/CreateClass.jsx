import React, { useEffect, useState } from 'react';
import * as BlockService from "../../services/BlockService";
import * as ClassService from "../../services/ClassService";
import * as SubjectService from "../../services/SubjectService";
import * as UserService from "../../services/UserService";
// import * as UserService from "../../services/UserService";
import { toast } from "react-toastify";
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
const CreateClass = () => {
    const [nameClass, setNameClass] = useState('');
    const [year, setYear] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [block, setBlock] = useState('');
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState('')
    const [teacherHR, setTeacherHR] = useState('');
    const [subjectGroup, setSubjectGroup] = useState([]);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [classType, setClassType] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedSubjectAndTeacher, setSelectedSubjectAndTeacher] = useState({});
    const [dataSubject, setDataSubject] = useState([]);
    const [selectedClassType, setSelectedClassType] = useState([])
    const [teachers, setTeachers] = useState([]);
    const [dataSubjectId, setDataSubjectId] = useState([])
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const blocksData = await BlockService.getAllBlocks();
                setBlocks(blocksData);
            } catch (error) {
                console.error("Error fetching blocks:", error);
            }
        };
        fetchBlocks();
    }, []);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        setYear(`${currentYear}-${currentYear + 1}`);
    }, []);

    console.log(year)

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomsData = await ClassService.getAllRoomClass();
                setRooms(roomsData);
            } catch (error) {
                console.error("Error fetching blocks:", error);
            }
        };
        fetchRooms();
    }, []);

    console.log(rooms)

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const usersData = await UserService.getAllAccount();
                if (usersData?.data) {
                    const teacherUser = usersData.data.filter((user) => user.role === "Teacher");
                    setTeachers(teacherUser);
                } else {
                    console.error("No data found in usersData");
                }
            } catch (error) {
                console.error("Error fetching blocks:", error);
            }
        };
        fetchBlocks();
    }, []);

    console.log(teachers)


    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const subjectsData = await SubjectService.getAllSubjects();
                setDataSubject(subjectsData?.data);
            } catch (error) {
                console.error("Error fetching blocks:", error);
            }
        };
        fetchBlocks();
    }, []);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const classTypeData = await ClassService.getAllClassType();
                setClassType(classTypeData?.data);
            } catch (error) {
                console.error("Error fetching blocks:", error);
            }
        };
        fetchBlocks();
    }, []);


    // console.log(classType)
    // const handleCreateClass = () => {

    //     console.log({ nameClass, year, block, room, dataSubjectId, teacherHR })
    // };

    const handleCreateClass = async () => {
        setIsLoading(true); // Bật trạng thái loading

        const newClassData = {
            nameClass: nameClass,
            year: year,
            blockID: block,
            teacherHR: teacherHR,
            room: room,
            SubjectsId: dataSubjectId.idSubject,
            SubjectsChuyendeId: dataSubjectId.idSubjectChuyende,
            SubjectsPhuId: dataSubjectId.idSubjectPhu
        };

        try {
            const response = await ClassService.createClass(newClassData); // Call the existing createClass API function
            console.log(response);
            if (response.status === 'OK') {
                toast.success('Lớp học mới đã được tạo thành công!');
                // Clear form after creation
                setNameClass('');
                setYear('');
                setBlock('');
                setRoom('');
                setDataSubjectId('');
                setTeacherHR('');
                // Reload data (blocks, rooms, etc.)
                const blocksData = await BlockService.getAllBlocks();
                setBlocks(blocksData);
                const roomsData = await ClassService.getAllRoomClass();
                setRooms(roomsData);
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi tạo lớp học.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo lớp học.');
            console.error(error);
        } finally {
            setIsLoading(false); // Tắt trạng thái loading
        }
    };




    console.log(classType)

    function getNameBlockById(id) {
        const block = blocks.find(block => block._id === id);
        return block ? block.nameBlock : null; // Trả về nameBlock nếu tìm thấy, ngược lại trả về null
    }

    // Sử dụng hàm để tìm nameBlock của block có _id là '6717c5eaff6baca57f486e9d'


    // Mở modal khi chọn nhóm môn
    const handleSubjectGroupChange = (e) => {
        const selectedGroup = e.target.value;
        // Chuyển chuỗi JSON thành đối tượng
        const parsedGroup = selectedGroup ? JSON.parse(selectedGroup) : {};
        setSelectedClassType(parsedGroup)
        const nameBlock = getNameBlockById(block);

        // Lọc môn học từ các mảng nameSubject, nameSubjectChuyende, nameSubjectPhu
        const filteredSubjects = dataSubject.filter(subject =>
            // Kiểm tra nếu môn học thuộc bất kỳ mảng nào trong parsedGroup
            (
                parsedGroup.nameSubject.includes(subject.nameSubject) ||
                parsedGroup.nameSubjectChuyende.includes(subject.nameSubject) ||
                parsedGroup.nameSubjectPhu.includes(subject.nameSubject)
            ) &&
            subject.block === nameBlock
        );

        // Nhóm các môn học theo nameSubject
        const groupedSubjects = filteredSubjects.reduce((acc, item) => {
            if (!acc[item.nameSubject]) {
                acc[item.nameSubject] = [];
            }
            acc[item.nameSubject].push(item);
            return acc;
        }, {});


        setSelectedSubjects(groupedSubjects);
        setSubjectGroup(parsedGroup);
        setIsModalOpen(true);
    };


    // Xử lý khi chọn giáo viên trong modal
    const handleTeacherChange = (subjectName, subjectId) => {
        setSelectedSubjectAndTeacher(prevState => ({
            ...prevState,
            [subjectName]: subjectId, // Lưu giáo viên cho từng môn học
        }));
    };

    // Đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveTeachers = () => {
        function mapSubjectToIds(subjectList, subjectMapping) {
            return subjectList.map(subject => subjectMapping[subject]);
        }

        // Combine the data
        const combinedData = {
            idSubject: mapSubjectToIds(selectedClassType.nameSubject, selectedSubjectAndTeacher),
            idSubjectChuyende: mapSubjectToIds(selectedClassType.nameSubjectChuyende, selectedSubjectAndTeacher),
            idSubjectPhu: mapSubjectToIds(selectedClassType.nameSubjectPhu, selectedSubjectAndTeacher)
        };
        console.log(combinedData);
        // setSelectedSubjectAndTeacher(combinedData)
        setDataSubjectId(combinedData);
        setIsModalOpen(false);
    };

    const onBack = () => {
        window.history.back()
    }

    const handleSubmit = () => {

    }

    return (
        <div className=" h-screen max-w-4xl mx-auto ">
            <Breadcrumb
                title="Tạo lớp học đầu năm"
                buttonText="Lưu đơn"
                onButtonClick={handleCreateClass}
                onBack={onBack}
            />

            <div className="pt-16"></div>
            <div className=" space-y-6 bg-white p-8  rounded-lg shadow-xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên lớp học</label>
                    <input
                        type="text"
                        className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={nameClass}
                        onChange={(e) => setNameClass(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Năm học</label>
                    <input
                        type="text"
                        className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={year}
                        disabled
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Chọn khối</label>
                    <select
                        className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={block}
                        onChange={(e) => setBlock(e.target.value)}
                    >
                        <option value="">Chọn khối lớp</option>
                        {blocks?.map((block) => (
                            <option key={block._id} value={block._id}>
                                {block.nameBlock}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Chọn phòng</label>
                    <select
                        className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    >
                        <option value="">Chọn phòng học</option>
                        {rooms.data?.map((room) => (
                            <option key={room?._id} value={room?._id}>
                                {room?.nameRoom}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nhóm môn học</label>
                    <select
                        className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={subjectGroup}
                        onChange={handleSubjectGroupChange}
                    >
                        <option value="">Chọn nhóm môn</option>
                        {classType?.map((type) => (
                            <option
                                key={type._id}
                                value={JSON.stringify({
                                    nameSubject: type.nameSubject,
                                    nameSubjectChuyende: type.nameSubjectChuyende,
                                    nameSubjectPhu: type.nameSubjectPhu,
                                })}
                            >
                                {type.nameGroup}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Giáo viên chủ nhiệm</label>
                    <select
                        className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={teacherHR}
                        onChange={(e) => setTeacherHR(e.target.value)}
                    >
                        <option value="">Chọn giáo viên chủ nhiệm</option>
                        {teachers?.map((teacher) => (
                            <option key={teacher.id} value={teacher._id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                </div>

                {message && (
                    <div className="mt-6 text-center text-sm font-semibold text-green-500">{message}</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                            Chọn giáo viên cho các môn học
                        </h3>
                        <ul className="space-y-4">
                            {Object.keys(selectedSubjects).map((subjectName, subjectIndex) => (
                                <li key={subjectIndex} className="flex items-center">
                                    <div className="font-medium w-1/2">{subjectName}</div>
                                    <div className="w-1/2">
                                        <select
                                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2"
                                            value={selectedSubjectAndTeacher[subjectName] || ""}
                                            onChange={(e) => handleTeacherChange(subjectName, e.target.value)}
                                        >
                                            <option value="">Chọn giáo viên</option>
                                            {selectedSubjects[subjectName]?.map((subject, index) => (
                                                <option key={index} value={subject._id}>
                                                    {subject.teacherId.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                className="py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                                onClick={handleSaveTeachers}
                            >
                                Lưu
                            </button>
                            <button
                                className="py-2 px-6 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500"
                                onClick={closeModal}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default CreateClass;