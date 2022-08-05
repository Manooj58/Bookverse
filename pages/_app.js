import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
import Navbar from '../components/Navbar';

const MyApp = ({ Component, pageProps }) => (
    <ThemeProvider attribute="class">
      <div className="dark:bg-nft-dark bg-white min-h-screen">
        <Navbar />
      </div>
      <Script src="https://kit.fontawesome.com/a7110d492e.js" crossOrigin="anonymous" />
    </ThemeProvider>
);

export default MyApp;
