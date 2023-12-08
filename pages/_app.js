import { useEffect } from 'react';
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css';
// import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps, session }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, [])
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}


export default MyApp
