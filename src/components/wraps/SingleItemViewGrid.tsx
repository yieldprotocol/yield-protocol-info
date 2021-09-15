import React from 'react';

const SingleItemViewGrid = ({ item }: any) => (
  <div className="grid grid-rows-auto gap-y-8">
    {Object.keys(item).map((key: any) => (
      <div className="text-sm flex gap-x-10" key={key}>
        <div className="w-20">
          <i>{key}</i>
        </div>
        <div className="justify-self-start">{item[key]}</div>
      </div>
    ))}
  </div>
);

export default SingleItemViewGrid;
