import React from 'react';
import { useParams } from 'react-router-dom';
import SubNav from '../SubNav';
import MainViewWrap from '../wraps/MainViewWrap';
import BatchDecoder from './BatchDecoder';
import ProposalHashDecoder from './ProposalHashDecoder';

const Governance = () => {
  const { subnav } = useParams<{ subnav: string }>();

  return (
    <>
      <SubNav
        paths={[
          { path: `governance/batchDecoder`, name: 'Batch Decoder' },
          { path: `governance/proposalDecoder`, name: 'Proposal Decoder' },
        ]}
      />
      <MainViewWrap>
        {subnav === 'batchDecoder' && <BatchDecoder />}
        {subnav === 'proposalDecoder' && <ProposalHashDecoder />}
      </MainViewWrap>
    </>
  );
};

export default Governance;
