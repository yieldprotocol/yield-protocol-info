import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { wrapper } from '../state/stores/store';
import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default wrapper.withRedux(App);
