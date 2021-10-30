import React from 'react';
import { Link } from 'react-router-dom';

const ContractItem = ({ item }: any) => (
  <Link to={`/contracts/${item.contract.address}/events`}>
    <div className="rounded-lg p-5 align-middle justify-items-start hover:bg-green-300 shadow-sm bg-green-100 hover:opacity-70">
      <div className="rounded-lg p-.5 align-middle justify-items-center text-center">{item.name}</div>
    </div>
  </Link>
);

export default ContractItem;
