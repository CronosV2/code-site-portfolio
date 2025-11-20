import React from 'react';

export interface VCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const VCard: React.FC<VCardProps> = ({
  title,
  description,
  children,
  className = '',
  hoverable = false,
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-md p-6 border border-gray-200';
  const hoverStyles = hoverable ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-gray-600 mb-4">
          {description}
        </p>
      )}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};
