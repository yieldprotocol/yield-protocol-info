import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { updateChainId } from '../state/actions/application';
import { useAppDispatch } from '../state/hooks/general';
import { wrapper } from '../state/stores/store';
import '../styles/globals.css';
import { CHAIN_ID_LOCAL_STORAGE } from '../utils/constants';

const DynamicWeb3Provider = dynamic(() => import('../hooks/useWeb3Provider'), { ssr: false });
const DynamicLayout = dynamic(() => import('../components/Layout'), { ssr: false });

const App = ({ Component, pageProps }: AppProps) => {
  const dispatch = useAppDispatch();
  const [chainId] = useLocalStorage(CHAIN_ID_LOCAL_STORAGE, '1');

  useEffect(() => {
    dispatch(updateChainId(+chainId)); // update redux on mount
  }, []);

  return (
    <DynamicWeb3Provider>
      <DynamicLayout>
        <Component {...pageProps} />
      </DynamicLayout>
    </DynamicWeb3Provider>
  );
};

export default wrapper.withRedux(App);
