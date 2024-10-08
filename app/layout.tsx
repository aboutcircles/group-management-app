import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/NavBar';
import { ToastContainer } from 'react-toastify';
import EventToastNotifier from '@/components/layout/EventToastNotifier';
const font = DM_Sans({ subsets: ['latin'] });
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Circles Management Group',
  description: 'About Circles',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={font.className}>
        <Providers>
          <ToastContainer
            autoClose={false}
            draggable={false}
            position='bottom-right'
          />
          <main className='min-h-screen bg-white'>
            <div className='max-w-7xl min-h-screen mx-auto py-10 px-5'>
              <div className='flex gap-2 items-center justify-between sm:justify-normal mb-5 sm:mb-10'>
                <Image src='/logo.svg' alt='logo' width={120} height={100} />
                <span className='text-xl sm:text-2xl text-right sm:text-left font-bold text-primary mt-1 ml-10 sm:ml-15'>
                  Groups Dashboard
                </span>
              </div>
              {children}
              <EventToastNotifier />
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
