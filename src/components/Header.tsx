import React, { FC } from 'react';
import { useRouter } from 'next/router';
import AddressDisplay from './AddressDisplay';
import useContracts from '../hooks/useContracts';

const Header: FC = ({ children }) => {
  const contractMap = useContracts();
  const router = useRouter();
  const { name } = router.query;

  return (
    <div className="flex justify-center sm:pt-8 md:pt-10 py-8 align-middle mx-60 ">
      <div className="rounded-xl dark:bg-green-300 p-6">
        <h1 className="text-center font-bold text-2xl align-middle pb-2">{name}</h1>
        <div className="">
          <AddressDisplay addr={contractMap![name as string]?.address} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;
