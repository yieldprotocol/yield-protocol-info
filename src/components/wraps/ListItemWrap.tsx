import React from 'react';
import { Link } from 'react-router-dom';

const ListItemWrap = ({ item, type, children }: { item: any; type: string; children: any }) => (
  <Link to={`/${type}/${item.id}`}>
    <div
      className="rounded-md p-5 align-middle justify-items-start hover:bg-green-300 shadow-sm bg-green-100 hover:opacity-70"
      style={{
        background: `linear-gradient( ${item.startColor?.toString().concat('96')} , ${item.endColor?.toString()} )`,
      }}
    >
      <div className="rounded-md p-.5 align-middle justify-items-center">{children}</div>
    </div>
  </Link>
);

export default ListItemWrap;
