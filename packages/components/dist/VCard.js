import React from 'react';
export const VCard = ({ title, description, children, className = '', hoverable = false, }) => {
    const baseStyles = 'bg-white rounded-lg shadow-md p-6 border border-gray-200';
    const hoverStyles = hoverable ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
    return (React.createElement("div", { className: `${baseStyles} ${hoverStyles} ${className}` },
        title && (React.createElement("h3", { className: "text-xl font-semibold text-gray-900 mb-2" }, title)),
        description && (React.createElement("p", { className: "text-gray-600 mb-4" }, description)),
        children && (React.createElement("div", { className: "mt-4" }, children))));
};
