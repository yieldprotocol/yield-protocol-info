import SubNav from '../../../components/SubNav';
import ProposalHashDecoder from '../../../components/views/ProposalHashDecoder';
import MainViewWrap from '../../../components/wraps/MainViewWrap';

const ProposalDecoderPage = () => {
  return (
    <>
      <SubNav
        paths={[
          { path: `/decode/batch`, name: 'Batch Decoder' },
          { path: `/decode/proposal`, name: 'Proposal Decoder' },
        ]}
      />
      <MainViewWrap>
        <ProposalHashDecoder />
      </MainViewWrap>
    </>
  );
};

export default ProposalDecoderPage;
