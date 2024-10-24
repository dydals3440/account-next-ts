import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

import withAuth from '@shared/hocs/withAuth'
import Spacing from '@shared/Spacing'
import Flex from '@shared/Flex'
import Button from '@shared/Button'
import ListRow from '@shared/ListRow'

function MyPage() {
  const router = useRouter()
  return (
    <div>
      <Spacing size={100} />
      <Flex justify="center">
        <Button onClick={() => signOut({ callbackUrl: '/' })}>로그아웃</Button>
      </Flex>
      <Spacing
        size={8}
        backgroundColor="gray100"
        style={{ margin: '20px 0' }}
      />
      <ul>
        <ListRow
          contents={<ListRow.Texts title="약관" subTitle="약관목록 및 철회" />}
          withArrow
          onClick={() => router.push('/settings/terms')}
        />
      </ul>
    </div>
  )
}

export default withAuth(MyPage)
