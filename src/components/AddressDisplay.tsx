import React from 'react';
import { ethers } from 'ethers';
import { useAppSelector } from '../state/hooks/general';
import { useEnsName } from '../state/hooks/useEnsName';
import { CHAIN_INFO } from '../config/chainData';

const AddressDisplay = ({ addr, tx }: any) => {
  const chainId = useAppSelector((st: any) => st.chain.chainId);
  const ensName = useEnsName(addr);

  if (!addr) return null;

  return ethers.utils.isAddress(addr) || tx ? (
    <a
      href={`${CHAIN_INFO.get(chainId)?.explorer}/${tx ? 'tx' : 'address'}/${addr.trim()}`}
      target="_blank"
      rel="noreferrer"
    >
      <code className="dark:text-gray-900 text-smt hover:underline">{addr}</code>
    </a>
  ) : (
    <code className="dark:text-gray-900 text-smt">{ensName || addr}</code>
  );
};

export default AddressDisplay;
