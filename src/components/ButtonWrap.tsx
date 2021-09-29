import React from 'react';

const ButtonWrap = ({ label, handleClick }: any) => (
  <button
    type="submit"
    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    onClick={handleClick}
  >
    {label}
  </button>
);

export default ButtonWrap;
