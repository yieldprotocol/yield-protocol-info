import React from 'react';
import { ethers } from 'ethers';
import { CHAIN_INFO } from '../config/chainData';
import { useAppSelector } from '../state/hooks/general';

const AddressDisplay = ({ addr, tx }: any) => {
  const chainId = useAppSelector(({ application }) => application.chainId);

  if (!addr) return null;

  return ethers.utils.isAddress(addr.trim()) || tx ? (
    <a
      href={`${CHAIN_INFO.get(chainId)?.explorer}/${tx ? 'tx' : 'address'}/${addr.trim()}`}
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
