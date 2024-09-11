import React, { useEffect, useState } from 'react';
import * as ClassService from "../../../services/ClassService";
import { useQuery } from '@tanstack/react-query';

const columns = [
    { id: 'nameClass', label: 'Class Name', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 100 },
    { id: 'classID', label: 'Class ID', minWidth: 170 },
    { id: 'createdAt', label: 'Created At', minWidth: 170, format: (value) => new Date(value).toLocaleDateString() },
    { id: 'questions', label: 'Questions', minWidth: 170, format: (value) => value.length },
    { id: 'teacher', label: 'Teacher Name', minWidth: 170, format: (value) => value.name || 'N/A' },
];

export const ClassManage = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch all class data
    const getAllClass = async () => {
        const res = await ClassService.getAllClass();
        return res;
    };

    const { data: allClass, isLoading, isError } = useQuery({
        queryKey: ["allClass"],
        queryFn: getAllClass,
    });

    useEffect(() => {
        if (isLoading) {
            console.log("Data is loading...");
        }

        if (isError) {
            console.error("An error occurred while fetching class data.");
        }

        if (allClass && !isLoading) {
            console.log("Class data fetched successfully:", allClass);
        }
    }, [allClass, isLoading, isError]);

    // Handle page and rows per page
    const handleChangePage = (newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Paginated rows based on fetched data
    const paginatedRows = allClass?.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

    return (
        <div className="w-full overflow-hidden">
            <div className="bg-white rounded-2xl" style={{ padding: "12px 20px" }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    className={`min-w-[${column.minWidth}px] p-2 border-b border-gray-300`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRows.map((row, index) => (
                            <tr
                                key={index}
                                className={`cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.id}
                                        className="p-2"
                                    >
                                        {column.format
                                            ? column.format(row[column.id] || row.teacherID)
                                            : row[column.id]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center p-4">
                <div>
                    <select
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        className="p-2 border border-gray-300 rounded"
                    >
                        {[10, 25, 100].map((option) => (
                            <option key={option} value={option}>
                                {option} rows per page
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <span className="mx-4">
                        Page {page + 1} of {Math.ceil((allClass?.length || 0) / rowsPerPage)}
                    </span>
                    <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= Math.ceil((allClass?.length || 0) / rowsPerPage) - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
