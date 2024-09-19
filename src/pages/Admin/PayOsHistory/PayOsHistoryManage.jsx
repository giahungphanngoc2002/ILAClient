import React, { useEffect, useState } from 'react';
import * as PayOsHistoryService from "../../../services/PayOSHistoryService";
import { useQuery } from '@tanstack/react-query';

const columns = [
    { id: 'orderCode', label: 'Order Code', minWidth: 170 }, // Changed to match expected data properties
    { id: 'transactionId', label: 'Transaction ID', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 170 },
    { id: 'count', label: 'Count', minWidth: 170 },
    { id: 'account', label: 'Account', minWidth: 170 }, // Assuming the data includes 'account'
    { id: 'amount', label: 'Amount', minWidth: 170 }, // Fixed typo 'amonut' to 'amount'
    { id: 'createdAt', label: 'Created At', minWidth: 170, format: (value) => new Date(value).toLocaleDateString() },
];

export const PayOsHistoryManage = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch all history data
    const getAllHistoryPayOs = async () => {
        const res = await PayOsHistoryService.getAllHistoryPayOs();
        return res;
    };

    const { data: allHistoryPayOS, isLoading, isError } = useQuery({
        queryKey: ["allHistoryPayOS"],
        queryFn: getAllHistoryPayOs,
    });

    console.log(allHistoryPayOS?.data)

    useEffect(() => {
        if (isLoading) {
            console.log("Data is loading...");
        }

        if (isError) {
            console.error("An error occurred while fetching data.");
        }

        if (allHistoryPayOS && !isLoading) {
            console.log("Data fetched successfully:", allHistoryPayOS);
        }
    }, [allHistoryPayOS, isLoading, isError]);

    // Handle page and rows per page
    const handleChangePage = (newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Paginated rows based on fetched data
    const paginatedRows = allHistoryPayOS?.data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

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
                        {paginatedRows.length > 0 ? (
                            paginatedRows.map((row, index) => (
                                <tr
                                    key={index}
                                    className={`cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                                >
                                    {columns.map((column) => (
                                        <td key={column.id} className="p-2">
                                            {column.format
                                                ? column.format(row[column.id])
                                                : row[column.id]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-4">
                                    No data available
                                </td>
                            </tr>
                        )}
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
                        Page {page + 1} of {Math.ceil((allHistoryPayOS?.data?.length || 0) / rowsPerPage)}
                    </span>
                    <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= Math.ceil((allHistoryPayOS?.data?.length || 0) / rowsPerPage) - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
