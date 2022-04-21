import SubNav from '../../../components/SubNav';
import BatchDecoder from '../../../components/views/BatchDecoder';
import MainViewWrap from '../../../components/wraps/MainViewWrap';

const BatchDecoderPage = () => (
  <>
    <SubNav
      paths={[
        { path: `/decode/batch`, name: 'Batch Decoder' },
        { path: `/decode/proposal`, name: 'Proposal Decoder' },
      ]}
    />
    <MainViewWrap>
      <BatchDecoder />
    </MainViewWrap>
  </>
);

export default BatchDecoderPage;
