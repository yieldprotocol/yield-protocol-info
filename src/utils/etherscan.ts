import { CHAIN_INFO } from '../config/chainData';

export function addHexPrefix(addrLike: string) {
  if (addrLike.startsWith('0x')) {
    return addrLike;
  }
  return `0x${addrLike}`;
}

async function* asyncGenerator(max: number) {
  let i = 0;
  while (i < max) {
    yield i;
    i += 1;
  }
}

export async function fetchEtherscan(
  chainId: number,
  params: URLSearchParams,
  logger: (arg0: string) => void
): Promise<any> {
  let resp;
  let respJson;
  const maxAttempts = 5;
  for await (const attempt of asyncGenerator(maxAttempts)) {
    const url = `${CHAIN_INFO.get(chainId)?.etherscanApi}?${params}`;

    resp = await fetch(url);
    respJson = await resp.json();

    if (!('message' in respJson) || (respJson.message as string).startsWith('OK')) {
      return respJson;
    }
    if (attempt + 1 === maxAttempts) {
      break;
    }
    const delaySeconds = 5 + 2 ** attempt;
    logger(
      `Failed to quest etherscan: ${respJson.message} - ${
        respJson.result
      }; will try again in ${delaySeconds} seconds; attempts left: ${maxAttempts - attempt - 1}`
    );

    await new Promise((resolve, _) => {
      setTimeout(resolve, delaySeconds * 1000);
    });
  }
  return Promise.reject(new Error(`Failed to quest etherscan: ${respJson.message} - ${respJson.result}`));
}

export async function fetchTransactionInput(chainId: number, tx_hash: string, logger: (arg0: string) => void) {
  const transaction: any = (
    await fetchEtherscan(
      chainId,
      new URLSearchParams({
        module: 'proxy',
        action: 'eth_getTransactionByHash',
        txhash: addHexPrefix(tx_hash),
      }),
      logger
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
    }),
    (x) => console.log(x)
  );

  return JSON.parse(ret.result[0].ABI);
}
