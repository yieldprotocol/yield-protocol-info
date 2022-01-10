import { ApolloClient, InMemoryCache } from '@apollo/client';

export default new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/yieldprotocol/v2-mainnet',
  cache: new InMemoryCache(),
});
