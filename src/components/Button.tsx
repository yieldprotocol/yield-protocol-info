import React from 'react';

const Button = ({ label, action }: { label: string; action: any }) => (
  <button
    type="button"
    onClick={action}
    className="w-full h-full text-gray-900 hover:bg-green-500 bg-green-300 flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-green-800 focus-visible:ring-offset-green-900 transition dark:text-white dark:hover:bg-green-500 text-md leading-5 rounded-md px-3 py-2"
  >
    {label}
  </button>
);

export default Button;
