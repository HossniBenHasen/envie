import { ThemeProvider } from '@material-tailwind/react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  const customTheme = {
    input: {
      defaultProps: {
        color: 'teal',
      },
    },
    select: {
      defaultProps: {
        color: 'teal',
      },
    },
  };
  return (
    <SessionProvider session={session}>
      <ThemeProvider value={customTheme}>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
