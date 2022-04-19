import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import Layout from '../components/Layout';
import { store } from '../state/stores/store';
import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
};

export default App;
