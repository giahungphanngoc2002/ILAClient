import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const NotificationForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [file, setFile] = useState(null);
    const [nameFilter, setNameFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [selectedTab, setSelectedTab] = useState('tab1'); // Tab state
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();


    const recipientsTab1 = [
        { id: 1, name: 'Ngô Ngọc Phúc An', phone: '0905337103', class: '10/7' },
        { id: 2, name: 'Nguyễn Nhật Anh', phone: '0932415393', class: '10/7' },
        { id: 3, name: 'Lê Văn Bình', phone: '0912456789', class: '10/6' },
        { id: 4, name: 'Trần Thị Thu Hằng', phone: '0987654321', class: '10/8' },
        { id: 5, name: 'Phạm Minh Huy', phone: '0901234567', class: '10/5' },
        { id: 6, name: 'Đinh Thu Hà', phone: '0933546721', class: '10/4' },
        { id: 7, name: 'Nguyễn Hoàng Nam', phone: '0967812345', class: '10/3' },
        { id: 8, name: 'Trần Mai Lan', phone: '0978123456', class: '10/9' },
        { id: 9, name: 'Vũ Phương Dung', phone: '0913456723', class: '10/2' },
        { id: 10, name: 'Lê Quốc Bảo', phone: '0921345678', class: '10/1' },
        { id: 11, name: 'Nguyễn Thị Tâm', phone: '0934456789', class: '10/10' },
        { id: 12, name: 'Phan Đình Khánh', phone: '0945567890', class: '10/3' },
        { id: 13, name: 'Trần Văn Minh', phone: '0989987654', class: '10/5' },
        { id: 14, name: 'Ngô Lan Hương', phone: '0912345678', class: '10/7' },
        { id: 15, name: 'Phạm Thị Vân', phone: '0932567891', class: '10/4' },
        { id: 16, name: 'Bùi Văn Kiên', phone: '0945678901', class: '10/6' },
        { id: 17, name: 'Đặng Mai Hoa', phone: '0972345678', class: '10/8' },
        { id: 18, name: 'Trịnh Thị Thanh', phone: '0987651234', class: '10/9' },
        { id: 19, name: 'Hoàng Văn Tú', phone: '0923456789', class: '10/2' },
        { id: 20, name: 'Nguyễn Thị Tuyết', phone: '0938765432', class: '10/1' },
    ];

    const recipientsTab2 = [
        { id: 3, name: 'Trần Văn B', phone: '0932456789', class: '10/7' },
        // Add more sample data here...
    ];

    const classes = ['10/1', '10/2', '10/3', '10/4', '10/5', '10/6', '10/7', '10/8', '10/9', '10/10'];

    const handleRecipientToggle = (id) => {
        setSelectedRecipients((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    console.log(selectedRecipients.length)

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        console.log({
            title,
            content,
            selectedRecipients,
            file,
        });
    };

    // Filter recipients based on name and class filters for each tab
    const filteredRecipients =
        selectedTab === 'tab1'
            ? recipientsTab1.filter((recipient) => {
                const matchesName = recipient.name.toLowerCase().includes(nameFilter.toLowerCase());
                const matchesClass = classFilter === '' || recipient.class === classFilter;
                return matchesName && matchesClass;
            })
            : recipientsTab2.filter((recipient) => {
                const matchesName = recipient.name.toLowerCase().includes(nameFilter.toLowerCase());
                const matchesClass = classFilter === '' || recipient.class === classFilter;
                return matchesName && matchesClass;
            });

    const handleSelectAllToggle = () => {
        if (selectAll) {
            setSelectedRecipients([]);
        } else {
            setSelectedRecipients(recipientsTab1.map((recipient) => recipient.id));
        }
        setSelectAll(!selectAll);
    };

    const selectedRecipientsTab1 = selectedRecipients.filter((id) =>
        recipientsTab1.some((recipient) => recipient.id === id)
    ).length;
    const selectedRecipientsTab2 = selectedRecipients.filter((id) =>
        recipientsTab2.some((recipient) => recipient.id === id)
    ).length;

    const onBack = () => {
        navigate('/manage/historySendNotification')
    }
    const [value, setValue] = useState('');

    return (
        <div>
            <Breadcrumb title="Gửi thông báo đa phương tiện"
                buttonText="Gửi thông báo"
                onButtonClick={handleSubmit}
                onBack={onBack}
            />

            <div style={{ height: '60px' }}></div>

            <div className="p-8 bg-gray-100 min-h-screen">

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
                        {/* <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 mb-4"
                        ></textarea> */}
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
                        {/* Tab Navigation */}


                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Chọn người nhận</h2>

                            {/* Filters */}
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
                                className={`px-4 py-2 font-semibold ${selectedTab === 'tab1' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                                    }`}
                                onClick={() => setSelectedTab('tab1')}
                            >
                                Học sinh - Số người nhận: {selectedRecipientsTab1 || 0}
                            </button>
                            <button
                                className={`px-4 py-2 font-semibold ${selectedTab === 'tab2' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                                    }`}
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

export default NotificationForm;
