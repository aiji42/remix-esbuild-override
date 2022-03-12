import React, { ComponentPropsWithRef, forwardRef } from "react"
import { css } from "@emotion/react"

type Props = {
  className?: string
} & ComponentPropsWithRef<"nav">

export const Navigation = forwardRef<HTMLElement, Props>(({ ...props }, ref) => {
  return (
    <nav {...props} ref={ref}>
      <a href="#" css={styles.link}>
        <span className="material-icons-round" css={styles.icon}>
          home
        </span>
        <span css={styles.linkText}>ホーム</span>
      </a>
      <a href="#" css={styles.link}>
        <span className="material-icons-round" css={styles.icon}>
          trending_up
        </span>
        <span css={styles.linkText}>トレンド</span>
      </a>
      <a href="#" css={styles.link}>
        <span className="material-icons-round" css={styles.icon}>
          notifications
        </span>
        <span css={styles.linkText}>通知</span>
      </a>
    </nav>
  )
})

const styles = {
  link: css`
    border-radius: 2px;
    color: inherit;
    display: flex;
    padding: 8px;
    text-decoration: none;
    &:hover {
      background-color: #e0e0e0;
    }
    & + & {
      margin-top: 4px;
    }
  `,
  icon: css`
    color: var(--color-dark-text-medium);
  `,
  linkText: css`
    font-weight: bold;
    margin-left: 8px;
  `,
}
