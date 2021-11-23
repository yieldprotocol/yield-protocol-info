import { Contract } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../state/hooks/general';
import { IContractMap } from '../../types/contracts';
import ContractItem from '../ContractItem';
import MainViewWrap from '../wraps/MainViewWrap';

const Contracts = () => {
  const contractMap: IContractMap = useAppSelector((st) => st.contracts.contractMap);
  const [contractsList, setContractsList] = useState<Contract[]>([]);

  useEffect(() => {
    Object.values(contractMap).length > 0 &&
      setContractsList([...Object.values(contractMap)].sort((s1: any, s2: any) => (s1?.name! < s2?.name! ? -1 : 1)));
  }, [contractMap]);

  if (!Object.values(contractMap).length) return <MainViewWrap>No Contracts</MainViewWrap>;

  return (
    <MainViewWrap>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {contractsList.map((item: any) => (
          <ContractItem item={item} key={item.contract.address} />
        ))}
      </div>
    </MainViewWrap>
  );
};

export default Contracts;
