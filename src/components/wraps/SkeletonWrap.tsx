import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useColorTheme } from '../../hooks/useColorTheme';

const SkeletonWrap = ({ ...props }: any) => {
  const { theme } = useColorTheme();
  const darkMode = theme === 'dark';
  return (
    <div className="w-full h-full">
      <SkeletonTheme color={darkMode ? '#6EE7B7' : '#D1FAE5'} highlightColor={darkMode ? '#A7F3D0' : '#ECFDF5'}>
        <Skeleton {...props} />
      </SkeletonTheme>
    </div>
  );
};

export default SkeletonWrap;
