import React from 'react';

const Button = ({ label, action, className = '' }: { label: string; action: any, className: string }) => (
  <button
    type="button"
    onClick={action}
    className={`w-full h-full text-gray-900 hover:bg-green-500 bg-green-300 flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-green-800 focus-visible:ring-offset-green-900 transition dark:text-gray-900 dark:hover:bg-green-500 text-md leading-5 rounded-lg px-3 py-2 ${className}`}
  >
    {label}
  </button>
);

export default Button;
