import React from 'react';
export const VInput = ({ label, error, helperText, className = '', ...props }) => {
    const inputStyles = error
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500';
    return (React.createElement("div", { className: "w-full" },
        label && (React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, label)),
        React.createElement("input", { className: `block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${inputStyles} ${className}`, ...props }),
        error && (React.createElement("p", { className: "mt-1 text-sm text-red-600" }, error)),
        helperText && !error && (React.createElement("p", { className: "mt-1 text-sm text-gray-500" }, helperText))));
};
