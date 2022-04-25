import { InferGetStaticPropsType } from 'next';
import Vaults from '../../components/views/Vaults';
import useAssets from '../../hooks/useAssets';
import useSeries from '../../hooks/useSeries';
import useVaults from '../../hooks/useVaults';
import { getAssets, getProvider, getSeries } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';
import { getMainnetVaults, getNotMainnetVaults } from '../../lib/vaults';

const StrategiesPage = ({ vaultList, assetMap, seriesMap }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const _vaultMap = useVaults();
  const _assetMap = useAssets();
  const _seriesMap = useSeries();
  return (
    <Vaults
      vaultList={_vaultMap ? Object.values(_vaultMap) : vaultList}
      assetMap={_assetMap ?? assetMap}
      seriesMap={_seriesMap ?? seriesMap}
    />
  );
};

export default StrategiesPage;

export const getStaticProps = async () => {
  const chainId = 1;
  const provider = getProvider(chainId);
  const contractMap = await getContracts(provider, chainId);
  const seriesMap = await getSeries(provider, contractMap);
  const assetMap = await getAssets(provider, contractMap);

  const vaultMap =
    chainId === 1
      ? await getMainnetVaults(contractMap, undefined, chainId)
      : await getNotMainnetVaults(contractMap, undefined, seriesMap, assetMap, chainId);
  const vaultList = Object.values(vaultMap).sort((v1, v2) => (+v1.art < +v2.art ? -1 : 1));

  return { props: { vaultList, seriesMap, assetMap }, revalidate: 1800 };
};
