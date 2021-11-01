import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAppSelector } from '../state/hooks/general';

const Spinner = ({ loading, ...props }: { loading: boolean }) => {
  const darkMode = useAppSelector((st) => st.application.darkMode);
  return loading ? (
    <div className="text-center">
      <ClipLoader loading={loading} color={darkMode ? '#34D399' : 'black'} {...props} />
    </div>
  ) : null;
};

export default Spinner;
