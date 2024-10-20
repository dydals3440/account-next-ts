import { getProviders, ClientSafeProvider, signIn } from 'next-auth/react'

import Flex from '@shared/Flex'
import Text from '@shared/Text'
import Spacing from '@shared/Spacing'
import Button from '@shared/Button'

function SigninPage({
  providers,
}: {
  providers: Record<string, ClientSafeProvider>
}) {
  return (
    <div>
      <Spacing size={100} />
      <Flex direction="column" align="center">
        <Text bold={true}>My Account</Text>
        <Spacing size={80} />
        <ul>
          {Object.values(providers).map((provider) => (
            <li key={provider.id}>
              <Button onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
                {provider.name} LOGIN
              </Button>
            </li>
          ))}
        </ul>
      </Flex>
    </div>
  )
}

export default SigninPage

export async function getServerSideProps() {
  const providers = await getProviders()

  console.log('providers', providers)

  return {
    props: {
      providers,
    },
  }
}
