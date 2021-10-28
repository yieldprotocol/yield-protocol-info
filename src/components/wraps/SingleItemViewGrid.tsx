import { ethers } from 'ethers';
import React from 'react';
import AddressDisplay from '../AddressDisplay';

const SingleItemViewGrid = ({ item }: any) => (
  <div className="grid grid-rows-auto gap-y-8">
    {Object.keys(item).map((key: any) => {
      const val = item[key];
      return ethers.utils.isAddress(val) ? (
        <div className="text-sm flex gap-x-10" key={key}>
          <div className="w-20">
            <i>{key}</i>
          </div>
          <div className="justify-self-start">
            <AddressDisplay addr={val} />
          </div>
        </div>
      ) : (
        <div className="text-sm flex gap-x-10" key={key}>
          <div className="w-20">
            <i>{key}</i>
          </div>
          <div className="justify-self-start">{item[key]}</div>
        </div>
      );
    })}
  </div>
);

export default SingleItemViewGrid;
