import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import useSWR from 'swr';
import { getAssets, getAssetsTvl, getSeries, getTotalDebt, getTotalDebtList } from '../lib/chain';
import { getContracts } from '../lib/contracts';

const useHomePageData = () => {
  const { chainId, provider } = useWeb3React();

  const _getHomePageData = async () => {
    const _provider = provider as ethers.providers.Web3Provider;
    const contractMap = await getContracts(_provider, chainId);
    const assetMap = await getAssets(_provider, contractMap);
    const seriesMap = await getSeries(_provider, contractMap);
    const assetsTvl = await getAssetsTvl(_provider, contractMap, assetMap, seriesMap);

    // get total debt data
    const totalDebtList = await getTotalDebtList(_provider, contractMap, seriesMap, assetMap);
    const totalDebt = getTotalDebt(totalDebtList);

    return { assetsTvl, totalDebtList, totalDebt, assetMap };
  };

  const { data, error } = useSWR(`/home/${chainId}`, () => _getHomePageData(), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  return { data, loading: !error && !data };
};

export default useHomePageData;
