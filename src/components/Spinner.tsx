import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useColorTheme } from '../hooks/useColorTheme';

const Spinner = ({ ...props }) => {
  const { theme } = useColorTheme();
  const darkMode = theme === 'dark';
  return (
    <div className="text-center">
      <ClipLoader loading={true} color={darkMode ? '#34D399' : 'black'} {...props} />
    </div>
  );
};

export default Spinner;
