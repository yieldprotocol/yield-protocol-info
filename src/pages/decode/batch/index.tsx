import dynamic from 'next/dynamic';
import SubNav from '../../../components/SubNav';
import MainViewWrap from '../../../components/wraps/MainViewWrap';

const DynamicBatchDecoder = dynamic(() => import('../../../components/views/BatchDecoder'), { ssr: false });

const BatchDecoderPage = () => (
  <>
    <SubNav
      paths={[
        { path: `/decode/batch`, name: 'batch' },
        { path: `/decode/proposal`, name: 'proposal' },
      ]}
    />
    <MainViewWrap>
      <DynamicBatchDecoder />
    </MainViewWrap>
  </>
);

export default BatchDecoderPage;
