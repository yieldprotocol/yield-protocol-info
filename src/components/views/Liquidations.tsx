import React from 'react';
import MainViewWrap from '../wraps/MainViewWrap';

const Liquidations = () => (
  <>
    <div style={{ padding: '1rem 3rem 1rem 3rem' }}>
    <h1>Active auctions</h1>
      <img
        alt="activeauctions"
        src="https://n6fcc052ak.execute-api.us-west-2.amazonaws.com/default/cw_export?widgetDefinition=%7B%22metrics%22%3A%20%5B%5B%22yield-liquidator%22%2C%20%22liquidations_count%22%2C%20%22instance%22%2C%20%22kovan.witch%3D0xab588f06be4ba4bbd0e0b236aece01cc0d9fa9b3.flash%3D0xc653a2b32e6c35e9f28be9a49ea31bad0ca5e678%22%2C%20%7B%22label%22%3A%20%22liquidations_count%3A%20kovan.witch%3D0xab588f06be4ba4bbd0e0b236aece01cc0d9fa9b3.flash%3D0xc653a2b32e6c35e9f28be9a49ea31bad0ca5e678%22%7D%5D%5D%2C%20%22view%22%3A%20%22timeSeries%22%2C%20%22stacked%22%3A%20false%2C%20%22stat%22%3A%20%22Maximum%22%2C%20%22period%22%3A%2060%2C%20%22title%22%3A%20%22Auctions%22%2C%20%22width%22%3A%201368%2C%20%22height%22%3A%20250%2C%20%22start%22%3A%20%22-PT1H%22%2C%20%22end%22%3A%20%22P0D%22%7D"
      />
    </div>
    <div style={{ padding: '1rem 3rem 1rem 3rem' }}>
      <h1>Vaults</h1>
      <img
        alt="vaults"
        src="https://n6fcc052ak.execute-api.us-west-2.amazonaws.com/default/cw_export?widgetDefinition=%7B%22metrics%22%3A%20%5B%5B%22yield-liquidator%22%2C%20%22vaults_count%22%2C%20%22instance%22%2C%20%22kovan.witch%3D0xab588f06be4ba4bbd0e0b236aece01cc0d9fa9b3.flash%3D0xc653a2b32e6c35e9f28be9a49ea31bad0ca5e678%22%2C%20%7B%22label%22%3A%20%22vaults_count%20kovan.witch%3D0xab588f06be4ba4bbd0e0b236aece01cc0d9fa9b3.flash%3D0xc653a2b32e6c35e9f28be9a49ea31bad0ca5e678%22%7D%5D%5D%2C%20%22view%22%3A%20%22timeSeries%22%2C%20%22stacked%22%3A%20false%2C%20%22stat%22%3A%20%22Maximum%22%2C%20%22period%22%3A%2060%2C%20%22title%22%3A%20%22Vaults%22%2C%20%22width%22%3A%201368%2C%20%22height%22%3A%20250%2C%20%22start%22%3A%20%22-PT1H%22%2C%20%22end%22%3A%20%22P0D%22%7D"
      />
    </div>
    <div style={{ padding: '1rem 3rem 1rem 3rem' }}>
      <h1>New block discovery lag</h1>
      <img
        alt="newblockdiscoverylag"
        src="https://n6fcc052ak.execute-api.us-west-2.amazonaws.com/default/cw_export?widgetDefinition=%7B%22metrics%22%3A%20%5B%5B%22yield-liquidator%22%2C%20%22new_block_delay%22%2C%20%22instance%22%2C%20%22kovan.witch%3D0xab588f06be4ba4bbd0e0b236aece01cc0d9fa9b3.flash%3D0xc653a2b32e6c35e9f28be9a49ea31bad0ca5e678%22%2C%20%7B%22label%22%3A%20%22new_block_delay%20kovan.witch%3D0xab588f06be4ba4bbd0e0b236aece01cc0d9fa9b3.flash%3D0xc653a2b32e6c35e9f28be9a49ea31bad0ca5e678%22%7D%5D%5D%2C%20%22view%22%3A%20%22timeSeries%22%2C%20%22stacked%22%3A%20false%2C%20%22stat%22%3A%20%22Maximum%22%2C%20%22period%22%3A%2060%2C%20%22title%22%3A%20%22Block%20delay%22%2C%20%22width%22%3A%201368%2C%20%22height%22%3A%20250%2C%20%22start%22%3A%20%22-PT1H%22%2C%20%22end%22%3A%20%22P0D%22%7D"
      />
    </div>
  </>
);

export default Liquidations;
