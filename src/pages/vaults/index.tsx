import { InferGetStaticPropsType } from 'next';
import { useState } from 'react';
import Vaults from '../../components/views/Vaults';
import useAssets from '../../hooks/useAssets';
import useSeries from '../../hooks/useSeries';
import useVaults from '../../hooks/useVaults';
import { getAssets, getProvider, getSeries } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';
import { getMainnetVaults } from '../../lib/vaults';

const VaultsPage = ({ vaultList, assetMap, seriesMap }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [search, setSearch] = useState<string | null>(null);
  const { data: _vaultMap, loading: vaultsLoading } = useVaults(search);
  const { data: _assetMap } = useAssets();
  const { data: _seriesMap } = useSeries();

  const handleSearch = (_search: string) => {
    setSearch(_search);
  };

  return (
    <Vaults
      vaultList={_vaultMap ? Object.values(_vaultMap) : vaultList}
      assetMap={_assetMap ?? assetMap}
      seriesMap={_seriesMap ?? seriesMap}
      vaultsLoading={vaultsLoading}
      search={handleSearch}
    />
  );
};

export default VaultsPage;

export const getStaticProps = async () => {
  const chainId = 1;
  const provider = getProvider(chainId);
  const contractMap = await getContracts(provider, chainId);
  const seriesMap = await getSeries(provider, contractMap);
  const assetMap = await getAssets(provider, contractMap);

  const vaultMap = await getMainnetVaults(contractMap, undefined, chainId, null);
  const vaultList = Object.values(vaultMap).sort((v1, v2) => (+v1.art < +v2.art ? -1 : 1));

  return { props: { vaultList, seriesMap, assetMap }, revalidate: 1800 };
};
