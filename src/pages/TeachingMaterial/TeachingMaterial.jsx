import React, { useState } from "react";
import { AiOutlineCloudUpload, AiOutlineDownload, AiOutlineDelete, AiOutlineFilePdf, AiOutlineFileWord, AiOutlineFileExcel, AiOutlineSearch } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop();
    switch (extension) {
        case 'pdf':
            return <AiOutlineFilePdf className="text-red-400" />;
        case 'docx':
            return <AiOutlineFileWord className="text-blue-400" />;
        case 'xlsx':
            return <AiOutlineFileExcel className="text-green-400" />;
        default:
            return <AiOutlineCloudUpload className="text-gray-400" />;
    }
};

const TeachingMaterial = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterType, setFilterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isGridView, setIsGridView] = useState(false);
    const filesPerPage = 10;

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            setFiles([...files, { file: selectedFile, uploadDate: new Date(), size: selectedFile.size }]);
            setSelectedFile(null);
            toast.success("File uploaded successfully!");
        }
    };

    const handleDownload = (file) => {
        const url = URL.createObjectURL(file.file);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.file.name);
        document.body.appendChild(link);
        link.click();
    };

    const handleDelete = (fileIndex) => {
        setFiles(files.filter((_, index) => index !== fileIndex));
    };

    // Filter and sort logic
    const filteredFiles = files
        .filter(file => filterType === 'all' || file.file.name.endsWith(filterType))
        .filter(file => file.file.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const sortedFiles = filteredFiles.sort((a, b) => {
        if (sortBy === 'name') {
            return a.file.name.localeCompare(b.file.name);
        } else if (sortBy === 'date') {
            return new Date(b.uploadDate) - new Date(a.uploadDate);
        } else if (sortBy === 'size') {
            return b.size - a.size;
        }
        return 0;
    });

    // Pagination logic
    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = sortedFiles.slice(indexOfFirstFile, indexOfLastFile);

    const totalPages = Math.ceil(sortedFiles.length / filesPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="w-full h-screen p-8 bg-white shadow-lg font-openSans overflow-auto">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Tài liệu giảng dạy</h1>

            {/* File Upload Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between space-x-4">
                    <input
                        type="file"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleUpload}
                        className="bg-green-500 text-white flex items-center px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                    >
                        <AiOutlineCloudUpload className="mr-2" /> Upload
                    </button>
                </div>
                {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                        Selected file: <span className="font-medium">{selectedFile.name}</span>
                    </p>
                )}
                <p className="text-xs mt-1 text-gray-500">Supported formats: .pdf, .docx, .xlsx. Max size: 5MB.</p>
            </div>

            {/* Search Bar and Sorting */}
            <div className="mb-4 flex justify-between">
                <div className="relative w-1/3">
                    <AiOutlineSearch className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Sort by */}
                <div>
                    <label className="mr-2">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-lg py-2 px-4"
                    >
                        <option value="name">Name</option>
                        <option value="date">Date</option>
                        <option value="size">Size</option>
                    </select>
                </div>

                {/* Filter by file type */}
                <div>
                    <label className="mr-2">Filter by type:</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border rounded-lg py-2 px-4"
                    >
                        <option value="all">All</option>
                        <option value="pdf">PDF</option>
                        <option value="docx">Word</option>
                        <option value="xlsx">Excel</option>
                    </select>
                </div>

                {/* Toggle View */}
                <div>
                    <button
                        onClick={() => setIsGridView(!isGridView)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                    >
                        {isGridView ? "List View" : "Grid View"}
                    </button>
                </div>
            </div>

            {/* File List Section */}
            {currentFiles.length === 0 ? (
                <p className="text-gray-500">No files found.</p>
            ) : (
                <div className={`${isGridView ? 'grid grid-cols-3 gap-4' : 'overflow-x-auto bg-gray-50 rounded-lg'}`}>
                    {isGridView ? (
                        currentFiles.map((file, index) => (
                            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                                {getFileTypeIcon(file.file.name)}
                                <p className="text-sm font-semibold">{file.file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                <button
                                    onClick={() => handleDownload(file)}
                                    className="bg-blue-500 text-white p-1 mt-2 rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    <AiOutlineDownload />
                                </button>
                            </div>
                        ))
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="px-4 py-2 text-left">File</th>
                                    <th className="px-4 py-2 text-left">Upload Date</th>
                                    <th className="px-4 py-2 text-left">Size</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFiles.map((file, index) => (
                                    <tr key={index} className="border-b bg-white hover:bg-gray-100 transition-all">
                                        <td className="px-4 py-2 flex items-center">
                                            {getFileTypeIcon(file.file.name)}
                                            <span className="ml-2 text-gray-800 break-words">{file.file.name}</span>
                                        </td>
                                        <td className="px-4 py-2">{file.uploadDate.toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{(file.size / 1024).toFixed(2)} KB</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleDownload(file)}
                                                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                                            >
                                                <AiOutlineDownload />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all ml-2"
                                            >
                                                <AiOutlineDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Pagination */}
            <div className="mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 px-3 py-1 rounded-lg ${index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TeachingMaterial;
