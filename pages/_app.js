import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
import { Navbar, Footer } from '../components';

const MyApp = ({ Component, pageProps }) => (
    <ThemeProvider attribute="class">
      <div className="dark:bg-book-dark bg-white min-h-screen">
        <Navbar />
        <Footer />
      </div>
      <Script src="https://kit.fontawesome.com/a7110d492e.js" crossOrigin="anonymous" />
    </ThemeProvider>
);

export default MyApp;
