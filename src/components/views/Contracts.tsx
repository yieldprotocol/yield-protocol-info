import React, { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../state/hooks/general';
import { IContract } from '../../types/contracts';
import ContractItem from '../ContractItem';
import Spinner from '../Spinner';
import MainViewWrap from '../wraps/MainViewWrap';

const Contracts: FC = () => {
  const { contractMap, contractsLoading } = useAppSelector(({ contracts }) => contracts);
  const [contractsList, setContractsList] = useState<IContract[]>([]);

  useEffect(() => {
    if (!contractMap) return;

    setContractsList(
      [...Object.keys(contractMap).map((name) => ({ contract: contractMap[name], name }))].sort((s1, s2) =>
        s1.name < s2.name ? -1 : 1
      )
    );
  }, [contractMap]);

  if (!contractsLoading && (!contractMap || !Object.values(contractMap!).length))
    return <MainViewWrap>No Contracts</MainViewWrap>;

  return (
    <MainViewWrap>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {contractsList.map((item) => (
          <ContractItem item={item} key={item.contract.address} />
        ))}
      </div>
    </MainViewWrap>
  );
};

export default Contracts;
