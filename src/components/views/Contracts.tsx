import React, { useState } from 'react';
import { useAppSelector } from '../../state/hooks/general';
import ContractItem from '../ContractItem';
import InputWrap from '../InputWrap';
import MainViewWrap from '../wraps/MainViewWrap';

const Contracts = () => {
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const [contractAddrInput, setContractAddrInput] = useState('');
  return (
    <MainViewWrap>
      <div>
        <div className="mb-20">
          <div className="my-4">Add Contract</div>
          <div className="w-1/2">
            <InputWrap
              name="address"
              value={contractAddrInput}
              label="Contract Address"
              type="string"
              handleChange={(e: any) => setContractAddrInput(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {[...Object.values(contractMap)].map((item: any) => (
            <ContractItem item={item} key={item.contract.address} />
          ))}
        </div>
      </div>
    </MainViewWrap>
  );
};

export default Contracts;
