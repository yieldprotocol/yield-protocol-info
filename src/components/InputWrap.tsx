import React from 'react';

interface IInputWrap {
  name: string;
  value: string;
  label: string;
  type: string;
  isError?: false;
  showErrorText?: false;
  message?: null;
  handleChange: any;
}

const InputWrap = ({
  name,
  value = '',
  label,
  type,
  handleChange = () => null,
  isError,
  showErrorText,
  message,
  ...props
}: IInputWrap) => (
  <div className="mt-2 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-green-300 rounded-md">
    <label htmlFor={name} className="block text-md font-medium text-gray-900">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      className="mt-2 focus:ring-green-500 focus:border-green-500 block w-full h-8 shadow-sm sm:text-sm border-green-300 rounded-md"
    />
    {showErrorText && isError}
    {message}
  </div>
);

InputWrap.defaultProps = {
  isError: null,
  showErrorText: false,
  message: undefined,
};

export default InputWrap;
