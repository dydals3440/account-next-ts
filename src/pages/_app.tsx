import type { AppProps } from 'next/app'
import { Global } from '@emotion/react'
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query'

import globalStyles from '@styles/globalStyles'
import Layout from '@shared/Layout'
import { SessionProvider } from 'next-auth/react'
import AuthGuard from '@components/auth/AuthGuard'
import Navbar from '@shared/Navbar'
import { AlertContextProvider } from '@contexts/AlertContext'

const client = new QueryClient({})

export default function App({
  Component,
  pageProps: { dehydratedState, session, ...pageProps },
}: AppProps) {
  return (
    <Layout>
      <Global styles={globalStyles} />
      <SessionProvider session={session}>
        <QueryClientProvider client={client}>
          {/* 서버측에서 수행한 값을, 클라이언트에도 그대로 복원해서 사용 가능.*/}
          {/* 이미 액션 호출이 일어났고, 키값으로 저장되어 있어서, 클라에서는 같은 키값으로 접근하면, 데이터가 바로 채워진 상태로 사용 가능 */}
          <Hydrate state={dehydratedState}>
            <AlertContextProvider>
              <AuthGuard>
                <Navbar />
                <Component {...pageProps} />
              </AuthGuard>
            </AlertContextProvider>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
    </Layout>
  )
}
