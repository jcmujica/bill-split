import React from 'react';

export const Button = ({ children, type = 'primary', className, ...rest }) => {
  const baseClasses = 'font-bold rounded max-h-12 p-2 w-full max-w-xs disabled:cursor-not-allowed';
  const typeClasses = type === 'outline'
    ? 'bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-slate-950'
    : 'bg-green-500 hover:bg-green-700 text-slate-950 disabled:bg-gray-500';

  return (
    <button
      className={`${baseClasses} ${typeClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
