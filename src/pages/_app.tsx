import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { AlertProvider } from '../context/AlertContext'
import { TextSizeProvider } from '../context/TextSizeContext'
import AlertContainer from '../components/AlertContainer'
import '../styles/globals.css'

type CustomAppProps = AppProps & {
  pageProps: {
    session?: any;
  }
}

function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: CustomAppProps) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={0}
      refetchWhenOffline={false}
      refetchOnWindowFocus={false}
    >
      <AlertProvider>
        <TextSizeProvider>
          <AlertContainer />
          <Component {...pageProps} />
        </TextSizeProvider>
      </AlertProvider>
    </SessionProvider>
  )
}

export default MyApp