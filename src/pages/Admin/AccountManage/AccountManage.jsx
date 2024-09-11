import React, { useState } from 'react';

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO Code', minWidth: 100 },
    { id: 'population', label: 'Population', minWidth: 170, format: (value) => value.toLocaleString('en-US') },
    { id: 'size', label: 'Size (km²)', minWidth: 170, format: (value) => value.toLocaleString('en-US') },
    { id: 'density', label: 'Density', minWidth: 170, format: (value) => value.toFixed(2) },
];

const rows = [
    { name: 'India', code: 'IN', population: 1324171354, size: 3287263 },
    { name: 'China', code: 'CN', population: 1403500365, size: 9596961 },
    { name: 'Italy', code: 'IT', population: 60483973, size: 301340 },
    { name: 'United States', code: 'US', population: 327167434, size: 9833520 },
    { name: 'Canada', code: 'CA', population: 37602103, size: 9984670 },
    { name: 'Australia', code: 'AU', population: 25475400, size: 7692024 },
    { name: 'Germany', code: 'DE', population: 83019200, size: 357578 },
    { name: 'Ireland', code: 'IE', population: 4857000, size: 70273 },
    { name: 'Mexico', code: 'MX', population: 126577691, size: 1972550 },
    { name: 'Japan', code: 'JP', population: 126317000, size: 377973 },
    { name: 'France', code: 'FR', population: 67022000, size: 640679 },
    { name: 'United Kingdom', code: 'GB', population: 67545757, size: 242495 },
    { name: 'Russia', code: 'RU', population: 146793744, size: 17098246 },
    { name: 'Nigeria', code: 'NG', population: 200962417, size: 923768 },
    { name: 'Brazil', code: 'BR', population: 210147125, size: 8515767 },
    { name: 'India', code: 'IN', population: 1324171354, size: 3287263 },
    { name: 'China', code: 'CN', population: 1403500365, size: 9596961 },
    { name: 'Italy', code: 'IT', population: 60483973, size: 301340 },
    { name: 'United States', code: 'US', population: 327167434, size: 9833520 },
    { name: 'Canada', code: 'CA', population: 37602103, size: 9984670 },
    { name: 'Australia', code: 'AU', population: 25475400, size: 7692024 },
    { name: 'Germany', code: 'DE', population: 83019200, size: 357578 },
    { name: 'Ireland', code: 'IE', population: 4857000, size: 70273 },
    { name: 'Mexico', code: 'MX', population: 126577691, size: 1972550 },
    { name: 'Japan', code: 'JP', population: 126317000, size: 377973 },
    { name: 'France', code: 'FR', population: 67022000, size: 640679 },
    { name: 'United Kingdom', code: 'GB', population: 67545757, size: 242495 },
    { name: 'Russia', code: 'RU', population: 146793744, size: 17098246 },
    { name: 'Nigeria', code: 'NG', population: 200962417, size: 923768 },
    { name: 'Brazil', code: 'BR', population: 210147125, size: 8515767 },
    { name: 'India', code: 'IN', population: 1324171354, size: 3287263 },
    { name: 'China', code: 'CN', population: 1403500365, size: 9596961 },
    { name: 'Italy', code: 'IT', population: 60483973, size: 301340 },
    { name: 'United States', code: 'US', population: 327167434, size: 9833520 },
    { name: 'Canada', code: 'CA', population: 37602103, size: 9984670 },
    { name: 'Australia', code: 'AU', population: 25475400, size: 7692024 },
    { name: 'Germany', code: 'DE', population: 83019200, size: 357578 },
    { name: 'Ireland', code: 'IE', population: 4857000, size: 70273 },
    { name: 'Mexico', code: 'MX', population: 126577691, size: 1972550 },
    { name: 'Japan', code: 'JP', population: 126317000, size: 377973 },
    { name: 'France', code: 'FR', population: 67022000, size: 640679 },
    { name: 'United Kingdom', code: 'GB', population: 67545757, size: 242495 },
    { name: 'Russia', code: 'RU', population: 146793744, size: 17098246 },
    { name: 'Nigeria', code: 'NG', population: 200962417, size: 923768 },
    { name: 'Brazil', code: 'BR', population: 210147125, size: 8515767 },
    { name: 'India', code: 'IN', population: 1324171354, size: 3287263 },
    { name: 'China', code: 'CN', population: 1403500365, size: 9596961 },
    { name: 'Italy', code: 'IT', population: 60483973, size: 301340 },
    { name: 'United States', code: 'US', population: 327167434, size: 9833520 },
    { name: 'Canada', code: 'CA', population: 37602103, size: 9984670 },
    { name: 'Australia', code: 'AU', population: 25475400, size: 7692024 },
    { name: 'Germany', code: 'DE', population: 83019200, size: 357578 },
    { name: 'Ireland', code: 'IE', population: 4857000, size: 70273 },
    { name: 'Mexico', code: 'MX', population: 126577691, size: 1972550 },
    { name: 'Japan', code: 'JP', population: 126317000, size: 377973 },
    { name: 'France', code: 'FR', population: 67022000, size: 640679 },
    { name: 'United Kingdom', code: 'GB', population: 67545757, size: 242495 },
    { name: 'Russia', code: 'RU', population: 146793744, size: 17098246 },
    { name: 'Nigeria', code: 'NG', population: 200962417, size: 923768 },
    { name: 'Brazil', code: 'BR', population: 210147125, size: 8515767 },
    { name: 'India', code: 'IN', population: 1324171354, size: 3287263 },
    { name: 'China', code: 'CN', population: 1403500365, size: 9596961 },
    { name: 'Italy', code: 'IT', population: 60483973, size: 301340 },
    { name: 'United States', code: 'US', population: 327167434, size: 9833520 },
    { name: 'Canada', code: 'CA', population: 37602103, size: 9984670 },
    { name: 'Australia', code: 'AU', population: 25475400, size: 7692024 },
    { name: 'Germany', code: 'DE', population: 83019200, size: 357578 },
    { name: 'Ireland', code: 'IE', population: 4857000, size: 70273 },
    { name: 'Mexico', code: 'MX', population: 126577691, size: 1972550 },
    { name: 'Japan', code: 'JP', population: 126317000, size: 377973 },
    { name: 'France', code: 'FR', population: 67022000, size: 640679 },
    { name: 'United Kingdom', code: 'GB', population: 67545757, size: 242495 },
    { name: 'Russia', code: 'RU', population: 146793744, size: 17098246 },
    { name: 'Nigeria', code: 'NG', population: 200962417, size: 923768 },
    { name: 'Brazil', code: 'BR', population: 210147125, size: 8515767 },
];

export const AccountManage = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                                        className={`p-2 text-${column.align || 'left'}`}
                                    >
                                        {column.format && typeof row[column.id] === 'number'
                                            ? column.format(row[column.id])
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
                        Page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}
                    </span>
                    <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );

};

