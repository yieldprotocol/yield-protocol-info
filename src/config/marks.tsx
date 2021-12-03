import React from 'react';
import DaiMark from '../components/logos/DaiMark';
import EthMark from '../components/logos/EthMark';
import TSTMark from '../components/logos/TSTMark';
import USDCMark from '../components/logos/USDCMark';
import WBTCMark from '../components/logos/WBTCMark';
import USDTMark from '../components/logos/USDTMark';
import StEthMark from '../components/logos/StEthMark';
import LinkMark from '../components/logos/LinkMark';
import ENSMark from '../components/logos/ENSMark';
import UNIMark from '../components/logos/UNIMark';

export const markMap = new Map<string, any>([
  ['DAI', <DaiMark key="dai" />],
  ['USDC', <USDCMark key="usdc" />],
  ['WBTC', <WBTCMark key="wbtc" />],
  ['TST', <TSTMark key="tst" />],
  ['ETH', <EthMark key="eth" />],
  ['USDT', <USDTMark key="usdt" />],
  ['WSTETH', <StEthMark key="wsteth" />],
  ['LINK', <LinkMark key="link" />],
  ['ENS', <ENSMark key="ens" />],
  ['UNI', <UNIMark key="uni" />],
]);
