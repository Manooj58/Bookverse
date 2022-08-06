import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { Navbar, Footer } from '../components';

import '../styles/globals.css';
import { BookProvider } from '../context/BookContext';

const MyApp = ({ Component, pageProps }) => (
  <BookProvider>
    <ThemeProvider attribute="class">
      <div className="dark:bg-book-dark bg-white min-h-screen">
        <Navbar />
        <div className="pt-65">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
      <Script src="https://kit.fontawesome.com/a7110d492e.js" crossOrigin="anonymous" />
    </ThemeProvider>
  </BookProvider>
);

export default MyApp;
