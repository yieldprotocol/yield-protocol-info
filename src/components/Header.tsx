import React from 'react';
import { useParams } from 'react-router-dom';
import AddressDisplay from './AddressDisplay';
import { useAppSelector } from '../state/hooks/general';

const SubNav = ({ children }: { children: any }) => {
  const { addr } = useParams<{ addr: string }>();
  const contractMap = useAppSelector((st: any) => st.contracts.contractMap);

  return (
    <div className="flex justify-center sm:pt-8 md:pt-10 py-8 align-middle mx-60 ">
      <div className="rounded-xl dark:bg-green-300 p-6">
        <h1 className="text-center font-bold text-2xl align-middle pb-2">{contractMap[addr].name}</h1>
        <div className="">
          <AddressDisplay addr={addr} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default SubNav;
