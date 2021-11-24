import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { IContract } from '../types/contracts';

const ContractItem: FC<{ item: IContract }> = ({ item }) => (
  <Link to={`/contracts/${item.contract.address}/events`}>
    <div className="rounded-lg p-5 align-middle justify-items-start hover:bg-green-300 shadow-sm bg-green-100 hover:opacity-80 dark:bg-green-400">
      <div className="rounded-lg p-.5 align-middle justify-items-center text-center">{item.name}</div>
    </div>
  </Link>
);

export default ContractItem;
