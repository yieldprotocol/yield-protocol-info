import Head from 'next/head';
import { FC } from 'react';
import Footer from './Footer';
import Navigation from './Navigation';

const Layout: FC = ({ children }) => (
  <>
    <Head>
      <title>Yield Protocol Info</title>
      <meta name="Yield Protocol Info App" content="Yield Protocol Info" />
      <link rel="apple-touch-icon" href="/logo.svg" />
      <link rel="manifest" href="/favicons/site.webmanifest" />
    </Head>
    <Navigation />
    {children}
    <Footer />
  </>
);

export default Layout;
