import React from 'react';
import { Link } from 'react-router-dom';

const RoleItem = ({ item, children, roles }: any) => (
  <Link to={`/${roles ? 'roles' : 'contracts'}/${item.contract.address}`}>
    <div className="rounded-md p-5 align-middle justify-items-start hover:bg-green-300 shadow-sm bg-green-100 hover:opacity-70">
      <div className="rounded-md p-.5 align-middle justify-items-center text-center">{item.name}</div>
    </div>
  </Link>
);

export default RoleItem;
