/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { FiCheckCircle as Check, FiCopy as Copy } from 'react-icons/fi';
import { copyToClipboard } from '../../utils/appUtils';

const CopyWrap = ({ children, value }: any) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = (e: any) => {
    e.stopPropagation();
    setCopied(true);
    copyToClipboard(value);
  };

  useEffect(() => {
    copied && (async () => setTimeout(() => setCopied(false), 5000))();
  }, [copied]);

  return (
    <div
      className="flex gap-4 text-center align-middle hover:text-gray-600 cursor-pointer"
      onClick={(e: any) => copy(e)}
    >
      {children}
      {copied ? <Check /> : <Copy />}
    </div>
  );
};

export default CopyWrap;
