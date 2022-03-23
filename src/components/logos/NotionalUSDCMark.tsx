import React from 'react';
import NotionalMark from './NotionalMark';
import USDCMark from './USDCMark';

const NotionalUSDCMark = () => (
  <div className="relative">
    <NotionalMark />
    <div className="absolute -left-2 -top-2">
      <USDCMark />
    </div>
  </div>
);

export default NotionalUSDCMark;
