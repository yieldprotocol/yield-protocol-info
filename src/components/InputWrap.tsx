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
  <div className="w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      className="focus:ring-green-500 focus:border-green-500 block w-full h-full shadow-sm sm:text-sm border-green-300 bg-green-50 rounded-md"
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
