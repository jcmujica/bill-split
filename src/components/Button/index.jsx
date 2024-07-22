import React from 'react';

export const Button = ({ children, type = 'primary', className, ...rest }) => {
  const baseClasses = 'font-bold rounded max-h-12 p-2 w-full disabled:cursor-not-allowed';
  const typeClasses = type === 'outline'
    ? 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
    : 'bg-blue-500 hover:bg-blue-700 text-white disabled:bg-gray-500';

  return (
    <button
      className={`${baseClasses} ${typeClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};