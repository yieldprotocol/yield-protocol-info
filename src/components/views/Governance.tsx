import { useRouter } from 'next/router';
import SubNav from '../SubNav';
import MainViewWrap from '../wraps/MainViewWrap';
import BatchDecoder from './BatchDecoder';
import ProposalHashDecoder from './ProposalHashDecoder';

const Governance = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <>
      <SubNav
        paths={[
          { path: `/decode/batch`, name: 'Batch Decoder' },
          { path: `/decode/proposal`, name: 'Proposal Decoder' },
        ]}
      />
      <MainViewWrap>
        {pathname.includes('batch') && <BatchDecoder />}
        {pathname.includes('proposal') && <ProposalHashDecoder />}
      </MainViewWrap>
    </>
  );
};

export default Governance;
