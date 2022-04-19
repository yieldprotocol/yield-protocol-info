import { CHAIN_INFO } from '../config/chainData';

export function addHexPrefix(addrLike: string) {
  const _addrLike = addrLike.trim();
  if (_addrLike.startsWith('0x')) {
    return _addrLike;
  }
  return `0x${_addrLike}`;
}

export async function fetchEtherscan(chainId: number, params: URLSearchParams): Promise<any> {
  const url = `${CHAIN_INFO.get(chainId)?.etherscanApi}?${params}`;

  try {
    const resp = await fetch(url);
    return await resp.json();
  } catch (e) {
    console.log('error getting etherscan data', e);
    return undefined;
  }
}

export async function fetchTransactionInput(chainId: number, tx_hash: string, logger: (arg0: string) => void) {
  const transaction: any = (
    await fetchEtherscan(
      chainId,
      new URLSearchParams({
        module: 'proxy',
        action: 'eth_getTransactionByHash',
        txhash: addHexPrefix(tx_hash),
      })
    )
  ).result;
  return transaction.input;
}

export async function getABI(chainId: number, target: string) {
  const ret = await fetchEtherscan(
    chainId!,
    new URLSearchParams({
      module: 'contract',
      action: 'getsourcecode',
      address: addHexPrefix(target),
      apikey: process.env.REACT_APP_ETHERSCAN_API_KEY as string,
    })
  );

  return JSON.parse(ret.result[0].ABI);
}
