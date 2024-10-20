import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { createPortal } from 'react-dom'

import Button from '@shared/Button'
import { colors } from '@styles/colorPalette'

interface FixedBottomButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
}

function FixedBottomButton({
  label,
  onClick,
  disabled,
}: FixedBottomButtonProps) {
  // SSR 에러 방지 -> 이때 아무것도 그리지 않게
  // 이러면, 서버쪽 그리는 데이터, 클라이언트에서 그리는 hTml이 맞지 않아서 에러 발생.
  // if (typeof window === 'undefined')

  const $portalRoot = document.getElementById('root-portal')

  if ($portalRoot == null) {
    return null
  }

  return createPortal(
    <Container>
      <Button
        disabled={disabled}
        size="medium"
        full
        onClick={onClick}
        css={buttonStyles}
      >
        {label}
      </Button>
    </Container>,
    $portalRoot,
  )
}

const slideup = keyframes`
    to {
        transform: translateY(0);
    }
`

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.white};
  padding: 20px 10px 8px;
  // 안보이게 만들고.
  transform: translateY(100%);
  // forwards 속성을 통해, to 값으로 유지되게함.
  animation: ${slideup} 0.5s ease-in-out forwards;
`

const buttonStyles = css`
  border-radius: 8px;
`

export default FixedBottomButton
