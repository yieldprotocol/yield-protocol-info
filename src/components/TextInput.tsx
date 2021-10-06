import React, { useState } from 'react';

const TextInput = ({
  name,
  action,
  placeHolder,
}: {
  name: string;
  action: any;
  placeHolder: string;
}) => {
  const [value, setValue] = useState('');
  return (
    <div className="relative rounded-md shadow-sm bg-green-300 h-full w-full ">
      <input
        type="text"
        placeholder={placeHolder}
        onChange={(e) => setValue(e.target.value)}
        className="p-3 block w-full pl-10 pr-12 sm:text-sm rounded-md h-full bg-green-50  focus:ring-0 ring-0"
        value={value}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            action(value);
          }
        }}
      />
    </div>
  );
};

export default TextInput;
