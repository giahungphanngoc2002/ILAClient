import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import * as ClassService from "../../services/ClassService";
import * as NotificationService from "../../services/NotificationService";
import { useSelector } from 'react-redux';

const NotificationToStudent = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [file, setFile] = useState(null);
    const [nameFilter, setNameFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [selectedTab, setSelectedTab] = useState('tab1'); // Tab state
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user);
    const [senderId, setSenderId] = useState(user?.id);

    useEffect(() => {
        setSenderId(user?.id);
    }, [user]);

    console.log(senderId)
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await ClassService.getAllClass();
                setClassData(response.data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    // Filter for recipientsTab1 (students)
    const recipientsTab1 = classData.flatMap((classItem) =>
        classItem?.studentID.map(student => ({
            id: student?._id,
            name: student?.username, // Derive "name" from email if needed
            phone: student?.phone || 'N/A', // Default phone if not available
            class: classItem?.nameClass
        }))
    );

    // Filter for recipientsTab2 (teachers)
    const recipientsTab2 = classData.map((classItem) => ({
        id: classItem?.teacherHR?._id,
        name: classItem?.teacherHR?.username, // Derive "name" from email if needed
        phone: classItem?.teacherHR?.phone || 'N/A', // Default phone if not available
        class: classItem?.nameClass
    }));

    // Extract classes
    const classes = classData.map((classItem) => classItem.nameClass);

    const handleRecipientToggle = (id) => {
        setSelectedRecipients((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const notificationData = {
            title,
            content: content.replace(/^<p>|<\/p>$/g, ''),
            senderId, // Set senderId from the user data
            receiverId: selectedRecipients, // Assuming selectedRecipients is an array of recipient IDs
        };
        console.log(senderId)
        console.log(selectedRecipients)

        try {
            const response = await NotificationService.createNotification(notificationData);
            console.log('Notification created successfully:', response);

            // Navigate to history or show success message
            navigate('/manage/historySendNotification');
        } catch (error) {
            console.error("Error creating notification:", error);
            // Optionally, display an error message to the user
        }
    };

    // Filter recipients based on name and class filters for each tab
    const filteredRecipients =
        selectedTab === 'tab1'
            ? recipientsTab1.filter((recipient) => {
                const matchesName = recipient?.name?.toLowerCase().includes(nameFilter?.toLowerCase());
                const matchesClass = classFilter === '' || recipient.class === classFilter;
                return matchesName && matchesClass;
            })
            : recipientsTab2.filter((recipient) => {
                const matchesName = recipient?.name?.toLowerCase().includes(nameFilter?.toLowerCase());
                const matchesClass = classFilter === '' || recipient?.class === classFilter;
                return matchesName && matchesClass;
            });

    // Update handleSelectAllToggle to only select filtered students
    const handleSelectAllToggle = () => {
        if (selectAll) {
            setSelectedRecipients([]);
        } else {
            const selectedIds = filteredRecipients.map((recipient) => recipient.id);
            setSelectedRecipients(selectedIds);
        }
        setSelectAll(!selectAll);
    };

    // Count selected recipients for each tab
    const selectedRecipientsTab1 = selectedRecipients.filter((id) =>
        recipientsTab1.some((recipient) => recipient.id === id)
    ).length;
    const selectedRecipientsTab2 = selectedRecipients.filter((id) =>
        recipientsTab2.some((recipient) => recipient.id === id)
    ).length;


    const onBack = () => {
        navigate('/manage/historySendNotification')
    }

    console.log(content)

    return (
        <div>
            <Breadcrumb title="Gửi thông báo đa phương tiện"
                buttonText="Gửi thông báo"
                onButtonClick={handleSubmit}
                onBack={onBack}
            />

            <div style={{ height: '60px' }}></div>

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
                        <input type="file" onChange={handleFileChange} className="mb-2" />
                        <p className="text-sm text-red-500">Hệ thống chỉ chấp nhận các file Word, Excel, Pdf, PowerPoint, các file ảnh.</p>
                    </div>

                    {/* Right Side: Recipient selection with tabs */}
                    <div className="w-1/2 bg-white p-4 rounded-lg shadow overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Chọn người nhận</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Lọc theo tên"
                                    value={nameFilter}
                                    onChange={(e) => setNameFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <select
                                    value={classFilter}
                                    onChange={(e) => setClassFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Tất cả lớp</option>
                                    {classes.map((className) => (
                                        <option key={className} value={className}>
                                            {className}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex mb-4 border-b">
                            <button
                                className={`px-4 py-2 font-semibold ${selectedTab === 'tab1' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setSelectedTab('tab1')}
                            >
                                Học sinh - Số người nhận: {selectedRecipientsTab1 || 0}
                            </button>
                            <button
                                className={`px-4 py-2 font-semibold ${selectedTab === 'tab2' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setSelectedTab('tab2')}
                            >
                                Giáo viên chủ nhiệm - Số người nhận: {selectedRecipientsTab2 || 0}
                            </button>
                        </div>

                        {/* Recipient Table */}
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">STT</th>
                                    <th className="py-2 px-4 border">Họ tên</th>
                                    <th className="py-2 px-4 border">SĐT</th>
                                    <th className="py-2 px-4 border">Lớp</th>
                                    <th className="py-2 px-4 border text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAllToggle}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecipients.map((recipient, index) => (
                                    <tr key={recipient.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                        <td className="py-2 px-4 border">{index + 1}</td>
                                        <td className="py-2 px-4 border">{recipient.name}</td>
                                        <td className="py-2 px-4 border">{recipient.phone}</td>
                                        <td className="py-2 px-4 border">{recipient.class}</td>
                                        <td className="py-2 px-4 border text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedRecipients.includes(recipient.id)}
                                                onChange={() => handleRecipientToggle(recipient.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationToStudent;