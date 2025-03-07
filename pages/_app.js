import CssBaseline from '@mui/material/CssBaseline';
import '../styles/app.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { SessionProvider } from 'next-auth/react';


function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return (
    <SessionProvider session={session}>
      <CssBaseline />
      <Component {...pageProps} />
    </SessionProvider>
    
  )
}

export default MyApp
