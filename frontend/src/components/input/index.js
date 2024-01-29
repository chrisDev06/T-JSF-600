import React from 'react';

const Input = ({
    label = '',
    forName = '',
    type = '',
    className = '',
    inputClassName = '',
    isRequired = true,
    placeholder = '',
    value = '',
    onChange = () => { },
}) => {

    return (
        <div className={`${className}`}>
            <label htmlFor={forName} className="block text-sm font-medium text-gray-800">{label}</label>
            <input
                type={type}
                id={forName}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${inputClassName}`}
                placeholder={placeholder}
                required={isRequired}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};


export default Input;
