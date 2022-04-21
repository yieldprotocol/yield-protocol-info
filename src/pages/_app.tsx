import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { wrapper } from '../state/stores/store';
import '../styles/globals.css';

const DynamicWeb3Provider = dynamic(() => import('../hooks/useWeb3Provider'), { ssr: false });
const DynamicLayout = dynamic(() => import('../components/Layout'), { ssr: false });

const App = ({ Component, pageProps }: AppProps) => (
  <DynamicWeb3Provider>
    <DynamicLayout>
      <Component {...pageProps} />
    </DynamicLayout>
  </DynamicWeb3Provider>
);

export default wrapper.withRedux(App);
