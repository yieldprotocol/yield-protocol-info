import SubNav from '../../../components/SubNav';
import ProposalHashDecoder from '../../../components/views/ProposalHashDecoder';
import MainViewWrap from '../../../components/wraps/MainViewWrap';

const ProposalDecoderPage = () => (
  <>
    <SubNav
      paths={[
        { path: `/decode/batch`, name: 'batch' },
        { path: `/decode/proposal`, name: 'proposal' },
      ]}
    />
    <MainViewWrap>
      <ProposalHashDecoder />
    </MainViewWrap>
  </>
);

export default ProposalDecoderPage;
