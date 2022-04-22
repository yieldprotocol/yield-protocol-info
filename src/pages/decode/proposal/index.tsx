import dynamic from 'next/dynamic';
import SubNav from '../../../components/SubNav';
import MainViewWrap from '../../../components/wraps/MainViewWrap';

const DynamicProposalDecoder = dynamic(() => import('../../../components/views/ProposalHashDecoder'), { ssr: false });

const ProposalDecoderPage = () => (
  <>
    <SubNav
      paths={[
        { path: `/decode/batch`, name: 'batch' },
        { path: `/decode/proposal`, name: 'proposal' },
      ]}
    />
    <MainViewWrap>
      <DynamicProposalDecoder />
    </MainViewWrap>
  </>
);

export default ProposalDecoderPage;
