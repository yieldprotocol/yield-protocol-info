import React from 'react';
import { useParams } from 'react-router-dom';
import SubNav from '../SubNav';
import MainViewWrap from '../wraps/MainViewWrap';
import BatchDecoder from './BatchDecoder';

const Governance = () => {
  const { subnav } = useParams<{ subnav: string }>();

  return (
    <>
      <SubNav
        paths={[
          { path: `governance/batchDecoder`, name: 'batch decoder' },
          // { path: `governance/proposalDecoder`, name: 'proposal decoder' },
        ]}
      />
      <MainViewWrap>
        {subnav === 'batchDecoder' && <BatchDecoder />}
        {/* {subnav === 'proposalDecoder' && <code>not implemented</code>} */}
      </MainViewWrap>
    </>
  );
};

export default Governance;
