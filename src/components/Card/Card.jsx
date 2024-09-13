import React from 'react';

const Card = ({ icon, title, value, color }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className={`text-${color}-500 text-3xl mb-2`}>
                {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="text-center mt-4">
                <div className="text-4xl font-bold">{value}</div>
            </div>
        </div>
    );
};

export default Card;