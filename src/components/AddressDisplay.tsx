import React from 'react';
import { useAppSelector } from '../state/hooks/general';
import { NETWORK_LABEL as chainData } from '../config/networks';

const AddressDisplay = ({ addr }: any) => {
  const chainId = useAppSelector((st: any) => st.chain.chainId);
  return (
    <a
      href={`https://${chainId === '1' ? '' : `${chainData[chainId]}.`}etherscan.io/address/${addr}`}
      target="_blank"
      rel="noreferrer"
    >
      <code className="text-smt hover:underline">{addr}</code>
    </a>
  );
};

export default AddressDisplay;
