import React from 'react';

const Breadcrumb = ({
    title,
    buttonText,
    onButtonClick = () => { },
    onBack = () => { },
}) => {
    return (
        <div
            className="fixed top-0 left-0 w-full flex flex-row gap-4 px-4 py-2 bg-white justify-between z-50"
        >
            {/* Breadcrumb Header */}
            <div className="flex flex-row gap-2 items-center">
                <button onClick={onBack} className="hover:bg-gray-200 cursor-pointer p-2 rounded-full duration-300">
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path>
                    </svg>
                </button>
                <h5 className="text-lg font-medium m-0">{title}</h5>
            </div>
            {/* Send Notification Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    onClick={onButtonClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                    >
                        <path d="M14.7921 15.2713L7.51911 14.1881C6.9982 14.1105 6.5076 13.8947 6.09835 13.5632C5.6891 13.2317 5.37615 12.7966 5.19204 12.3031L2.09493 4.0007C1.81123 3.23877 2.18483 2.38693 2.93055 2.0966C3.115 2.02477 3.31246 1.99237 3.5102 2.00151C3.70794 2.01065 3.90157 2.06111 4.07861 2.14966L29.1908 14.6752C29.907 15.0326 30.2047 15.9161 29.854 16.6478C29.714 16.9433 29.4797 17.182 29.1908 17.3257L4.07787 29.852C3.90698 29.9364 3.72094 29.9858 3.53069 29.9974C3.34043 30.0089 3.14978 29.9823 2.96994 29.9192C2.79009 29.856 2.62468 29.7576 2.4834 29.6296C2.34213 29.5017 2.22784 29.3468 2.14724 29.1741C2.06035 28.9921 2.01094 28.7946 2.00195 28.5932C1.99296 28.3918 2.02458 28.1906 2.09493 28.0017L5.19204 19.6992C5.37615 19.2058 5.6891 18.7707 6.09835 18.4392C6.5076 18.1077 6.9982 17.8919 7.51911 17.8143L14.7921 16.7311C14.9678 16.706 15.1285 16.6185 15.2448 16.4845C15.361 16.3504 15.4251 16.179 15.4251 16.0016C15.4251 15.8241 15.361 15.6527 15.2448 15.5187C15.1285 15.3846 14.9678 15.2971 14.7921 15.272V15.2713Z" fill="#fff"></path>
                    </svg>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default Breadcrumb;
