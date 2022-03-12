import React, { ComponentPropsWithRef, forwardRef } from "react"
import { css } from "@emotion/react"

export type Data = { title: string; url: string }[]

type Props = {
  dataset: Data
  className?: string
} & ComponentPropsWithRef<"div">

export const Ranking = forwardRef<HTMLDivElement, Props>(({ dataset, ...props }, ref) => {
  return (
    <div css={styles.ranking} {...props} ref={ref}>
      <h2 css={styles.headline}>ランキング</h2>
      <ol css={styles.list}>
        {dataset.map((data) => (
          <li key={data.title} css={styles.listItem}>
            <a href={data.url} css={styles.link}>
              {data.title}
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
})

const styles = {
  ranking: css`
    background-color: var(--color-surface);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    padding: 16px;
  `,
  headline: css`
    font-size: var(--font-size-subhead);
  `,
  list: css`
    padding-left: 28px;
  `,
  listItem: css`
    margin-top: 16px;
    &::marker {
      color: var(--color-dark-text-medium);
      font-weight: bold;
    }
  `,
  link: css`
    color: inherit;
    display: block;
    margin-left: 8px;
    text-decoration: none;
    &:hover {
      color: var(--color-primary-dark);
    }
  `,
}
