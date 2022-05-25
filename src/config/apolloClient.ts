import { ApolloClient, InMemoryCache } from '@apollo/client';
import { CHAIN_INFO } from './chainData';

const getClient = (chainId: number) =>
  new ApolloClient({
    uri: `https://api.thegraph.com/subgraphs/name/yieldprotocol/${CHAIN_INFO.get(chainId).subgraphNetwork}`,
    cache: new InMemoryCache(),
  });

export default getClient;
