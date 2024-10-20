import type { AppProps } from 'next/app'
import { Global } from '@emotion/react'
import { QueryClient, QueryClientProvider } from 'react-query'

import globalStyles from '@styles/globalStyles'
import Layout from '@shared/Layout'
import { SessionProvider } from 'next-auth/react'
import AuthGuard from '@components/auth/AuthGuard'
import Navbar from '@shared/Navbar'

const client = new QueryClient({})

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Layout>
      <Global styles={globalStyles} />
      <SessionProvider session={session}>
        <QueryClientProvider client={client}>
          <AuthGuard>
            <Navbar />
            <Component {...pageProps} />
          </AuthGuard>
        </QueryClientProvider>
      </SessionProvider>
    </Layout>
  )
}
