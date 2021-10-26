import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchInput = ({
  name,
  value,
  action,
  placeHolder,
}: {
  name: string;
  value: string;
  action: any;
  placeHolder: string;
}) => (
  <div className="relative rounded-md shadow-sm bg-green-300 h-full w-full">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <span className="text-green-500 sm:text-md">
        <FiSearch />
      </span>
    </div>
    <input
      type="text"
      name={name}
      className="p-3 block w-full pl-10 pr-12 sm:text-sm rounded-md h-full bg-green-50 focus:outline-none"
      placeholder={placeHolder}
      value={value}
      onChange={action}
    />
  </div>
);

export default SearchInput;
