import { Html, Head, Main, NextScript } from 'next/document'

// SSR 에서만 렌더링, CSR 에서는 렌더링 X
// 기본 HTML 설정을 여기서 함.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="root-portal" />
      </body>
    </Html>
  )
}
