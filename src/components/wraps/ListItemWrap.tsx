import React from 'react';
import { Link } from 'react-router-dom';

const ListItemWrap = ({ item, type, children }: { item: any; type: string; children: any }) => (
  <Link to={`/${type}/${item.id}`}>
    <div className="bg-gray-50 rounded-md shadow-sm p-5 align-middle justify-items-start hover:bg-gray-100">
      {children}
    </div>
  </Link>
);

export default ListItemWrap;
