import Flex from '@shared/Flex'
import { css } from '@emotion/react'
import { colors } from '@styles/colorPalette'
import Link from 'next/link'
import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Button from '@shared/Button'

function Navbar() {
  const router = useRouter()
  const { data: session } = useSession()
  const showSignButton = ['/auth/signin'].includes(router.pathname) === false

  const renderButton = useCallback(() => {
    if (session != null) {
      return (
        <Link href={'/my'}>
          <Image
            src={session.user?.image ?? ''}
            alt="유저 이미지"
            width={40}
            height={40}
          />
        </Link>
      )
    }
    if (showSignButton) {
      return (
        <Link href="/auth/signin">
          <Button>로그인/회원가입</Button>
        </Link>
      )
    }
    return null
  }, [session, showSignButton])
  return (
    <Flex css={navbarStyles} justify="space-between" align="center">
      <Link href="/">MyAccount</Link>
      {renderButton()}
    </Flex>
  )
}

const navbarStyles = css`
  padding: 10px 24px;
  position: sticky;
  top: 0;
  background-color: ${colors.white};
  z-index: 10;
  border-bottom: 1px solid ${colors.gray100};
`

export default Navbar
