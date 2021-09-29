import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import ButtonWrap from '../ButtonWrap';
import ContractItem from '../ContractItem';
import InputWrap from '../InputWrap';
import MainViewWrap from '../wraps/MainViewWrap';

const Contracts = () => {
  const dispatch = useAppDispatch();
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const [contractAddrInput, setContractAddrInput] = useState('');
  const [contracts, setContracts] = useState<any[]>([]);

  const handleAdd = (addr: string) => {
    // isValidAddr(addr) && dispatch(addContract(addr));
    console.log('adding contract');
  };
  const isValidAddr = (addr: string) => {
    const isValid = true;
    return isValid && addr;
  };

  useEffect(() => {
    Object.values(contractMap).length && setContracts([...Object.values(contractMap)]);
  }, [contractMap]);

  return (
    <MainViewWrap>
      <div>
        <div className="mb-20">
          <div className="w-1/2">
            <div className="flex gap-3 justify-between">
              <InputWrap
                name="address"
                value={contractAddrInput}
                label="Contract Address"
                type="string"
                handleChange={(e: any) => setContractAddrInput(e.target.value)}
              />
              <ButtonWrap label="Add" handleClick={handleAdd} />
            </div>
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
