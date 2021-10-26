import React, { useState } from 'react';

const TextInput = ({
  name,
  value,
  action,
  onChange,
  placeHolder,
}: {
  name: string;
  value: string;
  action: any;
  onChange: any;
  placeHolder: string;
}) => (
  <div className="relative rounded-md shadow-sm bg-green-300 h-full w-full ">
    <input
      type="text"
      placeholder={placeHolder}
      onChange={(e) => onChange(e.target.value)}
      className="p-3 block w-full pl-10 pr-12 sm:text-sm rounded-md h-full bg-green-50 focus:outline-none"
      value={value}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          action(value);
        }
      }}
    />
  </div>
);

export default TextInput;
