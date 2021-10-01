import React from 'react';
import { useAppSelector } from '../state/hooks/general';

const AddressDisplay = ({ addr }: any) => {
  const chainId = useAppSelector((st: any) => st.chain?.chainId);
  const linkDomain = chainId === 42 ? `https://kovan.etherscan.io/` : `https://etherscan.io/address/`
  const linkPath = `${linkDomain}/address/${addr}/`
  return (
    <a href={linkPath} target="_blank" rel="noreferrer">
    <code className="text-smt hover:underline">{addr}</code>
  </a>
  )
};

export default AddressDisplay;
