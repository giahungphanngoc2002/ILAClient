import './index.css';

const Toggle = ({ isOn, handleToggle, userId }) => {
    return (
        <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
            <input
                id={`toggle-${userId}`}  // Sử dụng userId để tạo id duy nhất
                type="checkbox"
                checked={isOn}
                onChange={handleToggle}
                className="toggle-checkbox hidden"
            />
            <label
                htmlFor={`toggle-${userId}`}  // Liên kết đúng id với input
                className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300 ease-in-out ${isOn ? 'bg-green-500' : 'bg-gray-300'}`}
            >
                <span
                    className={`toggle-knob absolute top-0 left-0 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
            </label>
        </div>
    );
};

export default Toggle;

