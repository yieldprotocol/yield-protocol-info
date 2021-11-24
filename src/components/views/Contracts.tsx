import React, { FC, useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { useAppSelector } from '../../state/hooks/general';
import { IContractMap } from '../../types/contracts';
import ContractItem from '../ContractItem';
import MainViewWrap from '../wraps/MainViewWrap';

interface IContract {
  name: string;
  contract: Contract;
}

const Contracts: FC = () => {
  const contractMap: IContractMap = useAppSelector((st) => st.contracts.contractMap);
  const [contractsList, setContractsList] = useState<IContract[]>([]);

  useEffect(() => {
    Object.values(contractMap).length > 0 &&
      setContractsList(
        [...Object.keys(contractMap).map((name: string) => ({ contract: contractMap[name], name } as IContract))].sort(
          (s1: IContract, s2: IContract) => (s1?.name < s2?.name ? -1 : 1)
        )
      );
  }, [contractMap]);

  if (!Object.values(contractMap).length) return <MainViewWrap>No Contracts</MainViewWrap>;

  return (
    <MainViewWrap>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {contractsList.map((item: IContract) => (
          <ContractItem item={item} key={item.contract.address} />
        ))}
      </div>
    </MainViewWrap>
  );
};

export default Contracts;
