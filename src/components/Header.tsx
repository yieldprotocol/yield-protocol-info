import React from 'react';
import { useParams } from 'react-router-dom';
import AddressDisplay from './AddressDisplay';
import { useAppSelector } from '../state/hooks/general';


const SubNav = ({ children }: { children: any}) => {
  const { addr } = useParams<{ addr: string }>();
  const contractMap = useAppSelector((st: any) => st.contracts.contractMap);

  return (
      <div className="flex justify-center sm:pt-8 md:pt-10 p-8">
        <div>
          <div className="block">
            <h1 className="text-xl text-center font-bold">{contractMap[addr].name}</h1>
          </div>
          <AddressDisplay addr={addr}/>
        { children }
        </div>
      </div>
  );
};

export default SubNav;
