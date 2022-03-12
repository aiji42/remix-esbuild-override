import React, { ComponentPropsWithRef, forwardRef } from "react"
import { css } from "@emotion/react"

type Props = {
  className?: string
} & ComponentPropsWithRef<"footer">

export const Footer = forwardRef<HTMLElement, Props>(({ ...props }, ref) => {
  return (
    <footer css={styles.footer} {...props} ref={ref}>
      <div css={styles.links}>
        <a href="#" css={styles.link}>
          ヘルプ
        </a>
        <a href="#" css={styles.link}>
          利用規約
        </a>
        <a href="#" css={styles.link}>
          プライバシーポリシー
        </a>
      </div>
      <small css={styles.copyright}>©2021 Logotype</small>
    </footer>
  )
})

const styles = {
  footer: css`
    color: var(--color-dark-text-medium);
    font-size: var(--font-size-body2);
  `,
  links: css`
    display: flex;
    flex-wrap: wrap;
  `,
  link: css`
    color: inherit;
    margin-right: 16px;
    text-decoration: none;
    &:hover {
      color: var(--color-dark-text-high);
    }
  `,
  copyright: css`
    display: block;
    margin-top: 8px;
  `,
}
