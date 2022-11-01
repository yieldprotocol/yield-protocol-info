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
import YFIMark from '../components/logos/YFIMark';
import MakerMark from '../components/logos/MakerMark';
import NotionalDAIMark from '../components/logos/NotionalDAIMark';
import NotionalUSDCMark from '../components/logos/NotionalUSDCMark';
import FRAXMark from '../components/logos/FRAXMark';
import CVX3CRVMark from '../components/logos/CVX3CRVMark';
import { FDAI2212, FDAI2303, FETH2212, FETH2303, FUSDC2212, FUSDC2303 } from './assets';
import NotionalETHMark from '../components/logos/NotionalETHMark';

export const markMap = new Map<string, any>([
  ['DAI', <DaiMark key="dai" />],
  ['USDC', <USDCMark key="usdc" />],
  ['WBTC', <WBTCMark key="wbtc" />],
  ['TST', <TSTMark key="tst" />],
  ['ETH', <EthMark key="eth" />],
  ['WETH', <EthMark key="eth" />],
  ['USDT', <USDTMark key="usdt" />],
  ['WSTETH', <StEthMark key="wsteth" />],
  ['wstETH', <StEthMark key="wsteth" />],
  ['LINK', <LinkMark key="link" />],
  ['ENS', <ENSMark key="ens" />],
  ['UNI', <UNIMark key="uni" />],
  ['yvUSDC', <YFIMark key="yvusdc" />],
  ['MKR', <MakerMark key="mkr" />],
  ['FRAX', <FRAXMark key="frax" />],
  ['Cvx3Crv Mock', <CVX3CRVMark key="cvx3crv" />],
  ['cvx3crv', <CVX3CRVMark key="cvx3crv" />],
  ['FDAI2203', <NotionalDAIMark key="notional" seriesId="0x303130350000" />],
  ['FDAI2206', <NotionalDAIMark key="notional" seriesId="0x303130360000" />],
  ['FDAI2209', <NotionalDAIMark key="notional" seriesId="0x303130370000" />],
  ['FUSDC2203', <NotionalUSDCMark key="notional" seriesId="0x303230350000" />],
  ['FUSDC2206', <NotionalUSDCMark key="notional" seriesId="0x303230360000" />],
  ['FUSDC2209', <NotionalUSDCMark key="notional" seriesId="0x303230370000" />],
  ['FDAI2212', <NotionalDAIMark key="notional" seriesId="0x303130380000" />],
  ['FDAI2303', <NotionalDAIMark key="notional" seriesId="0x303130390000" />],
  ['FUSDC2212', <NotionalUSDCMark key="notional" seriesId="0x303230380000" />],
  ['FUSDC2303', <NotionalUSDCMark key="notional" seriesId="0x303230390000" />],
  ['FETH2212', <NotionalETHMark key="notional" seriesId="0x303030380000" />],
  ['FETH2303', <NotionalETHMark key="notional" seriesId="0x303030390000" />],
]);
