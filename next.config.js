/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  env: {
    REACT_APP_DEFAULT_CHAINID: process.env.REACT_APP_DEFAULT_CHAINID,
    REACT_APP_VERSION: process.env.REACT_APP_VERSION,
    REACT_APP_INFURA_KEY_V1: process.env.REACT_APP_INFURA_KEY_V1,
    REACT_APP_RPC_URL_42: process.env.REACT_APP_RPC_URL_42,
    REACT_APP_RPC_URL_1: process.env.REACT_APP_RPC_URL_1,
    REACT_APP_RPC_URL_4: process.env.REACT_APP_RPC_URL_4,
    REACT_APP_RPC_URL_5: process.env.REACT_APP_RPC_URL_5,
    REACT_APP_RPC_URL_10: process.env.REACT_APP_RPC_URL_10,
    REACT_APP_RPC_URL_69: process.env.REACT_APP_RPC_URL_69,
    REACT_APP_RPC_URL_42161: process.env.REACT_APP_RPC_URL_42161,
    REACT_APP_RPC_URL_421611: process.env.REACT_APP_RPC_URL_421611,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    infuraKey: process.env.INFURA_KEY,
    alchemyArbKey: process.env.ALCHEMY_ARBITRUM_KEY,
    alchemyArbRinkebyKey: process.env.ALCHEMY_ARBITRUM_RINKEBY_KEY,
  },
  images: {
    domains: ['n6fcc052ak.execute-api.us-west-2.amazonaws.com'],
  },
};

module.exports = nextConfig;
