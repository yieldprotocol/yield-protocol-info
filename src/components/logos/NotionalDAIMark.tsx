import React from 'react';
import DaiMark from './DaiMark';
import NotionalMark from './NotionalMark';

const NotionalDAIMark = () => (
  <div className="relative">
    <NotionalMark />
    <div className="absolute -left-2 -top-2">
      <DaiMark />
    </div>
  </div>
);

export default NotionalDAIMark;
