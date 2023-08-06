const yieldEnv = {
  addresses: {
    1: {
      Timelock: '0x3b870db67a45611CF4723d44487EAF398fAc51E3',
      Cloak: '0xaa7B33685e9730B4D700b8F3F190EcA5EC4cf106',
      SafeERC20Namer: '0x39bb9cBe0221D769E30bD08d185842065BcE1706',
      YieldMath: '0x856Ddd1A74B6e620d043EfD6F74d81b8bf34868D',
      YieldMathExtensions: '0xea3D459B61Ed77447fAdE80e5a3DE617e947aA1e',
      PoolView: '0x23cc87FBEBDD67ccE167Fa9Ec6Ad3b7fE3892E30',
      CompoundMultiOracle: '0x53FBa816BD69a7f2a096f58687f87dd3020d0d5c',
      ChainlinkMultiOracle: '0xcDCe5C87f691058B61f3A65913f1a3cBCbAd9F52',
      CompositeMultiOracle: '0xA81414a544D0bd8a28257F4038D3D24B08Dd9Bb4',
      JoinFactory: '0x7297644611Af0dBb1bE1C2B4885DE9288eDD81e8',
      FYTokenFactory: '0xA718fF3fA10fA9F797e98E35fd3A0bEc9e0AA67c',
      PoolFactory: '0xe4D5A6128308b4D5c5d1A107Be136AB75c9944Be',
      Cauldron: '0xc88191F8cb8e6D4a668B047c1C8503432c3Ca867',
      Ladle: '0x6cB18fF2A33e981D1e38A663Ca056c0a5265066A',
      Router: '0x1bF78bE42cD72bbFCCEEf67dCC0a0E2a0EB5da57',
      WitchV1: '0x53C3760670f6091E1eC76B4dd27f73ba4CAd5061',
      Witch: '0x08d2F5c96bB1F6BE04B49bcD869d5Af01db4c400',
      Wand: '0x21F7794cF4e9aF58cbd0A71Fd33C73458981239f',
      YearnVaultMultiOracle: '0xC597E9cA52Afc13F7F5EDdaC9e53DEF569236016',
      NotionalMultiOracle: '0x660bB2F1De01AacA46FCD8004e852234Cf65F3fb',
      StrategyRescue: '0x0702290D4da74A2004C7E77F66C4Bbd91FcA62bb'
    },
    42161: {
      Timelock: '0xd0a22827Aed2eF5198EbEc0093EA33A4CD641b6c',
      Cloak: '0x84066CAeA6186a02ED74EBF32BF008A47CbE26AD',
      YieldMath: '0x511707B1311d6C3319e7A5BE6edb12D3777Be0dA',
      YieldMathExtensions: '0xC445D7e3Cdc96840439560675Ca9023204Ea9aCD',
      PoolView: '0x3e9D89A883c00608d932f92bbD8bd948Bf1A9Cf6',
      SafeERC20Namer: '0xbD6BEe8D3B9D1Ee6b8105bED11A61FDCaE4Bff8B',
      Cauldron: '0x23cc87FBEBDD67ccE167Fa9Ec6Ad3b7fE3892E30',
      Ladle: '0x16E25cf364CeCC305590128335B8f327975d0560',
      Router: '0x83c4Cb8b9Eb49a8DB87455A5E6bb8f6bb24D42d9',
      ChainlinkUSDOracle: '0x30e042468e333Fde8E52Dd237673D7412045D2AC',
      AccumulatorOracle: '0x0ad9Ef93673B6081c0c3b753CcaaBDdd8d2e7848',
      WitchV1: '0x08173D0885B00BDD640aaE57D05AbB74cd00d669',
      Witch: '0x07C2C74811cB14a5003C3ccff7EC436d504ffFb6',
      CompositeMultiOracle: '0x750B3a18115fe090Bc621F9E4B90bd442bcd02F2'
    },
  },

  strategies: {
    1: [
      '0x7acfe277ded15caba6a8da2972b1eb93fe1e2ccd',
      '0x1144e14e9b0aa9e181342c7e6e0a9badb4ced295',
      '0xfbc322415cbc532b54749e31979a803009516b5d',
      '0x8e8d6ab093905c400d583efd37fbeeb1ee1c0c39',
      '0xcf30a5a994f9ace5832e30c138c9697cda5e1247',
      '0x831df23f7278575ba0b136296a285600cd75d076',
      '0xbd6277e36686184a5343f83a4be5ced0f8cd185a',
      '0x1565f539e96c4d440c38979dbc86fd711c995dd6',
    ],
    42161: [
      '0xe779cd75e6c574d83d3fd6c92f3cbe31dd32b1e1',
      '0x92a5b31310a3ed4546e0541197a32101fcfbd5c8',
      '0xd5b43b2550751d372025d048553352ac60f27151',
      '0xa3caf61fd23d374ce13c742e4e9fa9fac23ddae6',
      '0x54f08092e3256131954dd57c04647de8b2e7a9a9',
      '0x3353e1e2976dbbc191a739871faa8e6e9d2622c7',
    ],
  },

  assetColors: {
    DAI: '#F5AC37',
    USDC: '#2775CA',
    WBTC: '#5A5564',
    TST: '#D15034',
    WETH: '#FFFFFF',
    USDT: '#50af95',
    wstETH: '#00A3FF',
    LINK: '#2A5ADA',
  },

  /* 
    These series are the only active series to be factored into our liability calculations. 
    We will use these to filter the SeriesAdded events 
  */
  series: {
    Ids: [
      "0x0030ff00028e", // ETH 2309
      "0x0031ff00028e", // DAI 2309
      "0x0032ff00028e", // USDC 2309
      "0x00a0ff00028e", // uSDT 2309
      "0x0138ff00028e", // FRAX 2309

      "0x0030ff000291", // ETH 2312
      "0x0031ff000291", // DAI 2312
      "0x0032ff000291", // USDC 2312
      "0x00a0ff000291", // uSDT 2312
    ]
  },

  seasonColors: {
    WINTER: ['#D9D9D9', '#67F2FC', '#333333'],
    SPRING: ['#6AD99E', '#FF6BE4', '#333333'],
    SUMMER: ['#FFDE75', '#409C4D', '#333333'],
    FALL: ['#7255BD', '#D95948', '#ffffff'],
  },
};

export default yieldEnv;
