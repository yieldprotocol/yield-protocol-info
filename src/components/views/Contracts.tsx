import React from 'react';
import { useAppSelector } from '../../state/hooks/general';
import ContractItem from '../ContractItem';

const Contracts = () => {
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  return (
    <div>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {[...Object.values(contractMap)].map((item: any) => (
          <ContractItem item={item} key={item.contract.address} />
        ))}
      </div>
    </div>
  );
};

export default Contracts;
