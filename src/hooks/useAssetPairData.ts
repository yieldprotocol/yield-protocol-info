import { useWeb3React } from '@web3-react/core';
import useSWR from 'swr';
import { getAssetPairData } from '../lib/chain';
import { IAsset } from '../types/chain';
import useAssets from './useAssets';
import useContracts from './useContracts';

const useAssetPairData = (asset: IAsset) => {
  const { chainId } = useWeb3React();
  const contractMap = useContracts();
  const assetMap = useAssets();

  const { data, error } = useSWR(
    chainId && contractMap && assetMap && asset ? `/assetPairData?chainId=${chainId}&assetId=${asset.id}` : null,
    () => getAssetPairData(asset, assetMap, contractMap, chainId),
    {
      revalidateOnFocus: false,
    }
  );

  return { data, loading: !data && !error };
};

export default useAssetPairData;
