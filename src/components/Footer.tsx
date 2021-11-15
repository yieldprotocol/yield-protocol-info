import React from 'react';
import { useAppSelector } from '../state/hooks/general';

const Footer = () => {
  const version = useAppSelector((st) => st.application.version);
  return (
    <div className="z-10 fixed bottom-1 left-1 text-xs">
      <i>Version: {version}</i>
    </div>
  );
};

export default Footer;
