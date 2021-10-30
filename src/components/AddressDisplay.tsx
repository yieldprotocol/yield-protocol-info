import React from 'react';
import { ethers } from 'ethers';
import { useAppSelector } from '../state/hooks/general';
import { NETWORK_LABEL as chainData } from '../config/networks';

const AddressDisplay = ({ addr, tx }: any) => {
  const chainId = useAppSelector((st: any) => st.chain.chainId);

  if (!addr) return null;

  return ethers.utils.isAddress(addr) || tx ? (
    <a
      href={`https://${chainId === '1' ? '' : `${chainData[chainId]}.`}etherscan.io/${
        tx ? 'tx' : 'address'
      }/${addr.trim()}`}
      target="_blank"
      rel="noreferrer"
    >
      <code className="dark:text-gray-900 text-smt hover:underline">{addr}</code>
    </a>
  ) : (
    <code className="dark:text-gray-900 text-smt">{addr}</code>
  );
};

export default AddressDisplay;
