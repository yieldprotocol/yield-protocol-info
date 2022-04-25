import useSWR from 'swr';
import { getAssetPairData } from '../lib/chain';
import { useAppSelector } from '../state/hooks/general';
import { IAsset } from '../types/chain';
import useAssets from './useAssets';
import useContracts from './useContracts';

const useAssetPairData = (asset: IAsset) => {
  const chainId = useAppSelector(({ application }) => application.chainId);
  const contractMap = useContracts();
  const { data: assetMap } = useAssets();

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
