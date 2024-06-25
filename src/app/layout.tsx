import './global-styles.scss';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';
import { Providers } from '@/redux/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Icebods',
  description: 'Welcome to Icebods - Best UK Ice Baths',
  icons: {
    icon: '/images/svg/favicon.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <ToastContainer autoClose={1500} />
          <NavBar />
          {children}
        </body>
      </html>
    </Providers>
  );
}
