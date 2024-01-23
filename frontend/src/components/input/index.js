import React from 'react';

const Input = ({
    label = '',
    forname = '',
    type = '',
    className = '',
    isRequired = true,
    placeholder = '',
    value = '',
    onChange = () => { },
}) => {

    return (
        <div className="w-1/2">
            <label htmlFor={forname} className="block text-sm font-medium text-gray-800">{label}</label>
            <input
                type={type}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                focus:ring-blue-500 focus:border-blue500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue500 ${className}`}
                placeholder={placeholder}
                required={isRequired}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Input;
