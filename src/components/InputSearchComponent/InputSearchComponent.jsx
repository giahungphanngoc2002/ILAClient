import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value); // Trigger the search function passed from the parent component
    };

    return (
        <div className="flex justify-start mb-4 relative">
            <input
                type="text"
                placeholder="Tìm kiếm theo tên..."
                value={query}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full pr-10" // Add padding on the right for the icon
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
    );
};

export default SearchInput;
