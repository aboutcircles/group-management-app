import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/NavBar';
import { ToastContainer } from 'react-toastify';
import EventToastNotifier from '@/components/layout/EventToastNotifier';
const font = DM_Sans({ subsets: ['latin'] });

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
          <main className='flex min-h-screen flex-col items-center justify-center bg-background'>
            <EventToastNotifier />
            <div className='w-full md:w-[775px] sm:my-4 bg-primary shadow-sm p-4 min-h-screen sm:min-h-0 sm:h-auto sm:rounded-3xl flex gap-y-4 flex-col justify-around items-center'>
              <Navbar />
              <div className='w-full relative bg-background text-black rounded-2xl overflow-hidden'>
                {children}
              </div>
              <Footer />
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
