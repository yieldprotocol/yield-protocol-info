import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { wrapper } from '../state/stores/store';
import '../styles/globals.css';

const DynamicWeb3Provider = dynamic(() => import('../hooks/useWeb3Provider'), { ssr: false });

const App = ({ Component, pageProps }: AppProps) => (
  <DynamicWeb3Provider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </DynamicWeb3Provider>
);

export default wrapper.withRedux(App);
