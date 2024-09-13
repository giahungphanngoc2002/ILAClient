import React, { useEffect, useState } from 'react';
import * as UserService from "../../../services/UserService";
import { useQuery } from '@tanstack/react-query';

const columns = [
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'name', label: 'Họ và tên', minWidth: 100 },
    { id: 'phone', label: 'Số điện thoại', minWidth: 170 },
    { id: 'createdAt', label: 'Created At', minWidth: 170, format: (value) => new Date(value).toLocaleDateString() },
    { id: 'classes', label: 'SL lớp học', minWidth: 170, format: (value) => value?.length || 0 },
];

export const AccountManage = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch all user data
    const getAllUser = async () => {
        const res = await UserService.getAllUser();
        return res;
    };

    const { data: allUser, isLoading, isError } = useQuery({
        queryKey: ["allUser"],
        queryFn: getAllUser,
    });

    useEffect(() => {
        if (isLoading) {
            console.log("Data is loading...");
        }

        if (isError) {
            console.error("An error occurred while fetching user data.");
        }

        if (allUser && !isLoading) {
            console.log("User data fetched successfully:", allUser);
        }
    }, [allUser, isLoading, isError]);

    const handleChangePage = (newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Paginated rows based on fetched data
    const paginatedRows = allUser?.data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

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
                        Page {page + 1} of {Math.ceil((allUser?.data?.length || 0) / rowsPerPage)}
                    </span>
                    <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= Math.ceil((allUser?.data?.length || 0) / rowsPerPage) - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
