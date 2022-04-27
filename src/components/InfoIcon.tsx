import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import Popover from './PopOver';

interface IInfoIcon {
  infoText: string;
}

const InfoIcon = ({ infoText }: IInfoIcon) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <FiInfo className="hover:cursor-help" color="#3f3f46" />
      <Popover open={isHovered}>
        <div className="flex p-2 bg-gray-300 rounded-lg">
          <div className="text-gray-700 text-xs w-full whitespace-nowrap">{infoText}</div>
        </div>
      </Popover>
    </div>
  );
};

export default InfoIcon;
