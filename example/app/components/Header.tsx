import React, { ComponentPropsWithRef, forwardRef } from "react"
import { css } from "@emotion/react"
import { Button } from "~/components/Button"
import logoImage from "~/images/logotype.svg"

type Props = {
  className?: string
} & ComponentPropsWithRef<"header">

export const Header = forwardRef<HTMLElement, Props>(({ ...props }, ref) => {
  return (
    <header css={styles.header} {...props} ref={ref}>
      <div css={styles.inner}>
        <h1 css={styles.logo}>
          <img src={logoImage} width={116} height={24} alt="Logotype" />
        </h1>
        <Button onClick={() => alert("新規作成")} css={styles.button}>
          新規作成
        </Button>
        <img
          src="https://source.unsplash.com/random/80x80"
          width="40"
          height="40"
          alt="User Icon"
          css={styles.icon}
        />
      </div>
    </header>
  )
})

const styles = {
  header: css`
    background-color: var(--color-surface);
    display: flex;
    justify-content: center;
    padding: 12px 16px;
    position: sticky;
    top: 0;
    z-index: 1;
  `,
  inner: css`
    align-items: center;
    display: flex;
    width: min(100%, var(--width-contents));
  `,
  logo: css`
    align-items: center;
    display: flex;
  `,
  button: css`
    margin-left: auto;
  `,
  icon: css`
    border-radius: 50%;
    margin-left: 24px;
  `,
}
