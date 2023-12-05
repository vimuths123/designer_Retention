import { useEffect } from 'react';
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css';
// import { SessionProvider } from "next-auth/react"
import Script from 'next/script';

function MyApp({ Component, pageProps, session }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, [])
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async defer></Script>
      <Component {...pageProps} />
    </>
  )
}


export default MyApp
