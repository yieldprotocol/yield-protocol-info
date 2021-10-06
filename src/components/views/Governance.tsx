import React from 'react';
import { useParams } from 'react-router-dom';
import SubNav from '../SubNav';
import MainViewWrap from '../wraps/MainViewWrap';
import BatchDecoder from './BatchDecoder';


const Governance = () => {
    const { subnav } = useParams<{ subnav: string }>();
    console.log(subnav)


    return (
        <>
          <SubNav paths={[
              { path: `governance/batchdecoder`, name: 'batch decoder' },
              { path: `governance/proposaldecoder`, name: 'proposal decoder' },
              ]} />
          <MainViewWrap>
          {subnav === 'batchdecoder' && (
            <BatchDecoder/>
          )}
          {subnav === 'proposaldecoder' && (
            <code>not implemented</code>
          )}
          </MainViewWrap>
        </>

    )
}

export default Governance;
