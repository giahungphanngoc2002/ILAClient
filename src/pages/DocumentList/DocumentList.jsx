import React, { useEffect, useState } from 'react';
import { FaFilePdf, FaFileImage, FaFilePowerpoint } from 'react-icons/fa';
import { AiOutlineDownload } from 'react-icons/ai';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import * as ClassService from "../../services/ClassService";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

const DocumentList = () => {
    const user = useSelector((state) => state.user);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [userClass, setUserClass] = useState();
    const [loading, setLoading] = useState(false); // IsLoading state
    const [error, setError] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [subjects, setsubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");

    const [currentYear, setCurrentYear] = useState(() => {
        const year = new Date().getFullYear();
        return `${year}-${year + 1}`;
    });

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true); // Start loading
            try {
                const response = await ClassService.getAllClass();
                const userClass = findUserClass(response?.data || [], user.id, currentYear);
                setUserClass(userClass);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                setError(error);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchClasses();
    }, [currentYear, user.id]);

    const findUserClass = (allClasses, userId, currentYear) => {
        if (!Array.isArray(allClasses)) {
            console.error('All classes is not a valid array:', allClasses);
            return null;
        }

        const foundClass = allClasses.filter((classItem) => {
            return (
                Array.isArray(classItem.studentID) &&
                classItem.studentID.some((student) =>
                    typeof student === 'string'
                        ? student === userId
                        : student._id === userId
                ) &&
                classItem.year === currentYear // Add the condition to check the year
            );
        });
        if (!foundClass.length) {  // Check if any class was found
            console.warn('No class found for user:', userId);
        }

        return foundClass;
    };

    useEffect(() => {
        const fetchClassesDetail = async () => {
            setLoading(true); // Start loading
            try {
                const response = await ClassService.getDetailClass(selectedClass);
                const subjectsList = response.data.SubjectsId || []; // Ensure it's an array
                setsubjects(subjectsList); // Set subjects to the state
            } catch (error) {
                console.error("Failed to fetch class details:", error);
                setError(error);
            } finally {
                setLoading(false); // End loading
            }
        };

        if (selectedClass) {
            fetchClassesDetail();
        }
    }, [selectedClass]);

    useEffect(() => {
        const fetchSubjectData = async () => {
            setLoading(true); // Start loading
            try {
                const response = await ClassService.getResourcesBySubject(selectedClass, selectedSubject);
                const resources = response.data;

                if (resources && Array.isArray(resources)) {
                    const loadedFiles = resources.map((resource) => ({
                        fileId: resource._id,
                        file: { name: resource.linkResource },
                        uploadDate: new Date(resource.createdAt),
                        size: resource.size,
                        content:resource.content
                    }));

                    setDocuments(loadedFiles); // Update state with documents for the selected subject
                } else {
                    setDocuments([]); // Clear documents if none are found
                }
            } catch (error) {
                console.error("Error fetching subject data:", error);
                toast.error("Failed to load subject data.");
                setDocuments([]); // Clear documents on error
            } finally {
                setLoading(false); // End loading
            }
        };

        if (selectedSubject) {
            fetchSubjectData();
        }
    }, [selectedClass, selectedSubject]);

    console.log(documents)


    const renderIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FaFilePdf className="text-red-600 text-xl" />;
            case 'image':
                return <FaFileImage className="text-blue-500 text-xl" />;
            case 'ppt':
                return <FaFilePowerpoint className="text-orange-500 text-xl" />;
            default:
                return <FaFilePdf className="text-gray-500 text-xl" />;
        }
    };

    const handleDownload = async (doc) => {
        try {
            const response = await ClassService.downloadFileFromCloudinary(doc.fileId);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const fileName = doc.file.name.endsWith('.pdf') ? doc.file.name : `${doc.file.name}.pdf`;

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error.message);
            toast.error("Failed to download file.");
        }
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    return (
        <div className="h-screen max-w-6xl mx-auto p-6 grid grid-cols-12 gap-4">
            <Breadcrumb
                title="Tài liệu học tập"
                onBack={() => window.history.back()}
                displayButton={false}
            />
            <div className="col-span-3 bg-white rounded-lg shadow-md mt-12 overflow-y-auto max-h-screen">
                <h2 className="bg-blue-500 text-white text-xl font-bold mb-4 p-3">Danh mục môn học</h2>
                <ul className="p-0">
                    {loading ? (
                        <li className="text-gray-500 p-4">Đang tải...</li>
                    ) : subjects && subjects.length > 0 ? (
                        subjects.map(subject => (
                            <li
                                key={subject._id}
                                style={{ fontSize: "18px" }}
                                className={`px-4 py-2 cursor-pointer border-b ${selectedSubject === subject._id
                                    ? 'border-l-[4px] border-l-blue-500 bg-gray-100 text-blue-800'
                                    : 'bg-white text-gray-800'
                                    }`}
                                onClick={() => setSelectedSubject(subject._id)}
                            >
                                {subject.nameSubject}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 p-4">Không có môn học</li>
                    )}
                </ul>
            </div>

            <div className="col-span-9 bg-white rounded-lg shadow-md mt-12 overflow-x-auto max-h-screen">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mx-4 my-3">Tài liệu học tập</h2>
                    <select
                        value={selectedClass}
                        onChange={handleClassChange}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">--Chọn lớp học--</option>
                        {userClass && userClass.length > 0 ? (
                            userClass.map((classItem) => (
                                <option key={classItem._id} value={classItem._id}>
                                    {classItem.nameClass}
                                </option>
                            ))
                        ) : (
                            <option value="">Không có lớp học</option>
                        )}
                    </select>
                </div>
                {loading ? (
                    <div className="text-center p-6 text-gray-500">Đang tải tài liệu...</div>
                ) : documents && documents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-left">Tên tài liệu</th>
                                    <th className="p-3 text-left">Loại</th>
                                    <th className="p-3 text-left">Thời gian upload</th>
                                    <th className="p-3 text-left">Tải về</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((doc) => (
                                    <tr key={doc.fileId} className="border-b">
                                        <td className="p-3">{doc.content}</td>
                                        <td className="p-3">{renderIcon('pdf')}</td>
                                        <td className="p-3">{new Date(doc.uploadDate).toLocaleString()}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDownload(doc)}
                                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                                            >
                                                <AiOutlineDownload />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center p-6 text-gray-500">Chưa có tài liệu</div>
                )}
            </div>


        </div>
    );
};

export default DocumentList;
