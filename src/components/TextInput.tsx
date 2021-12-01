import React, { FC } from 'react';

interface ITextInputProps {
  name: string;
  value: string;
  action: any;
  onChange: any;
  placeHolder: string;
}

const TextInput: FC<ITextInputProps> = ({ name, value, action, onChange, placeHolder, ...props }) => (
  <div className="relative rounded-lg shadow-sm bg-green-300 h-full w-full">
    <input
      {...props}
      type="text"
      placeholder={placeHolder}
      onChange={(e) => onChange(e.target.value)}
      className="p-3 block w-full pl-10 pr-12 sm:text-sm rounded-lg h-full bg-green-50 focus:outline-none"
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
