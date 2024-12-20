import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import * as ClassService from "../../services/ClassService";
import * as NotificationService from "../../services/NotificationService";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

const NotificationToSchool = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [file, setFile] = useState(null);
    const [nameFilter, setNameFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [selectAllClasses, setSelectAllClasses] = useState(false);
    const navigate = useNavigate();
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user);
    const [senderId, setSenderId] = useState(user?.id);

    useEffect(() => {
        setSenderId(user?.id);
    }, [user]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await ClassService.getAllClass();
                setClassData(response.data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    // Combine student and teacher data by class
    const combinedRecipients = classData.reduce((acc, classItem) => {
        const studentRecipients = classItem?.studentID.map(student => ({
            id: student?._id,
            name: student?.username,
            phone: student?.phone || 'N/A',
            class: classItem?.nameClass,
            type: 'student', // Type is student
        }));

        const teacherRecipient = {
            id: classItem?.teacherHR?._id,
            name: classItem?.teacherHR?.username,
            phone: classItem?.teacherHR?.phone || 'N/A',
            class: classItem?.nameClass,
            type: 'teacher', // Type is teacher
        };

        acc[classItem?.nameClass] = [
            ...(acc[classItem?.nameClass] || []),
            ...studentRecipients,
            teacherRecipient
        ];

        return acc;
    }, {});

    // Handle selecting/deselecting all recipients in a class
    const handleClassSelect = (className, select) => {
        const recipientsForClass = combinedRecipients[className] || [];
        const recipientIds = recipientsForClass.map(recipient => recipient.id);
        if (select) {
            setSelectedRecipients((prev) => [...prev, ...recipientIds]);
        } else {
            setSelectedRecipients((prev) =>
                prev.filter(id => !recipientIds.includes(id))
            );
        }
    };

    // Handle selecting/deselecting all classes
    const handleSelectAllClasses = () => {
        if (selectAllClasses) {
            setSelectedRecipients([]);  // Deselect all
        } else {
            const allRecipients = Object.values(combinedRecipients).flat();
            const allRecipientIds = allRecipients.map((recipient) => recipient.id);
            setSelectedRecipients(allRecipientIds);  // Select all recipients
        }
        setSelectAllClasses(!selectAllClasses); // Toggle "Select All"
    };

    const classes = classData.map((classItem) => classItem.nameClass);

    const handleSubmit = async () => {
        const notificationData = {
            title,
            content: content.replace(/^<p>|<\/p>$/g, ''), // Clean up content
            senderId,
            receiverId: selectedRecipients,
        };

        try {
            const response = await NotificationService.createNotification(notificationData);
            console.log('Notification created successfully:', response);
            toast.success('Tạo thông báo thành công');
            navigate('/manage/historySendNotification');
        } catch (error) {
            toast.error('Error creating notification');
            console.error("Error creating notification:", error);
        }
    };

    const onBack = () => {
        navigate('/manage/historySendNotification');
    };

    return (
        <div>
            <Breadcrumb
                title="Gửi thông báo đa phương tiện"
                buttonText="Gửi thông báo"
                onButtonClick={handleSubmit}
                onBack={onBack}
            />

            <div className="px-8 bg-gray-100 mt-8 pb-14">
                <div className="flex gap-4 h-[calc(100vh-150px)]">
                    {/* Left Side: Text editor */}
                    <div className="w-1/2 bg-white p-4 rounded-lg shadow overflow-y-auto">
                        <label className="block font-medium mb-2">Tiêu đề</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                        />

                        <label className="block font-medium mb-2">Nội dung</label>
                        <div className="mb-20">
                            <ReactQuill
                                value={content}
                                onChange={setContent}
                                className="w-full h-80 mb-4 text-gray-800"
                            />
                        </div>

                        <label className="block font-medium mb-2">Đính kèm tài liệu</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
                        <p className="text-sm text-red-500">Hệ thống chỉ chấp nhận các file Word, Excel, Pdf, PowerPoint, các file ảnh.</p>
                    </div>

                    {/* Right Side: Recipient selection with classes */}
                    <div className="w-1/2 bg-white p-4 rounded-lg shadow overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4">Chọn lớp gửi thông báo</h2>
                        
                        {/* Checkbox to select/deselect all classes */}
                        

                        {/* Class-wise table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border">STT</th>
                                        <th className="py-2 px-4 border">Lớp</th>
                                        <th className="py-2 px-4 border text-center">
                                        <input
                                type="checkbox"
                                checked={selectAllClasses}
                                onChange={handleSelectAllClasses}
                               
                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.map((className, index) => {
                                        const recipientsForClass = combinedRecipients[className] || [];
                                        const isClassSelected = recipientsForClass.every((recipient) =>
                                            selectedRecipients.includes(recipient.id)
                                        );

                                        return (
                                            <tr key={className} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                                <td className="py-2 px-4 border">{index + 1}</td>
                                                <td className="py-2 px-4 border">{className}</td>
                                                
                                                <td className="py-2 px-4 border text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isClassSelected}
                                                        onChange={() => handleClassSelect(className, !isClassSelected)}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationToSchool;
