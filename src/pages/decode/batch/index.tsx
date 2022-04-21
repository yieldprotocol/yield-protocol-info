import SubNav from '../../../components/SubNav';
import BatchDecoder from '../../../components/views/BatchDecoder';
import MainViewWrap from '../../../components/wraps/MainViewWrap';

const BatchDecoderPage = () => (
  <>
    <SubNav
      paths={[
        { path: `/decode/batch`, name: 'batch' },
        { path: `/decode/proposal`, name: 'proposal' },
      ]}
    />
    <MainViewWrap>
      <BatchDecoder />
    </MainViewWrap>
  </>
);

export default BatchDecoderPage;
