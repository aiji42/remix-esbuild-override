import React, { ComponentPropsWithRef, forwardRef } from "react"
import { css } from "@emotion/react"
import { Button } from "~/components/Button"

export type Data = {
  thumbnail?: string
  date: string
  title: string
  favorites: number
  comments: number
  url: string
}

type Props = {
  data: Data
  className?: string
} & ComponentPropsWithRef<"article">

export const FeedItem = forwardRef<HTMLElement, Props>(({ data, ...props }, ref) => {
  const { thumbnail, date, title, favorites, comments, url } = data
  return (
    <>
      <article css={styles.feedItem} {...props} ref={ref}>
        {thumbnail && (
          <a href={url} css={styles.thumbnailWrapper}>
            <img src={thumbnail} alt="" css={styles.thumbnail} />
          </a>
        )}
        <div css={styles.information}>
          <a href={url} css={styles.itemLink}>
            <time dateTime={date} css={styles.postedAt}>
              {date}
            </time>
            <h3 css={styles.title}>{title}</h3>
          </a>
          <div css={styles.reactions}>
            <span className="material-icons-round" css={styles.reactionIcon}>
              favorite
            </span>
            <span css={styles.reactionCount}>{favorites}</span>
            <span className="material-icons-round" css={[styles.reactionIcon, { marginLeft: 24 }]}>
              mode_comment
            </span>
            <span css={styles.reactionCount}>{comments}</span>
            <Button
              size="s"
              variant="border"
              onClick={() => alert(`「${title}」を保存`)}
              css={styles.button}
            >
              保存
            </Button>
          </div>
        </div>
      </article>
    </>
  )
})

const styles = {
  feedItem: css`
    background-color: var(--color-surface);
    border-radius: 4px;
    overflow: hidden;
  `,
  thumbnailWrapper: css`
    display: block;
    overflow: hidden;
    padding-top: 52.5%;
    position: relative;
  `,
  thumbnail: css`
    height: auto;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
  `,
  information: css`
    padding: 16px;
  `,
  itemLink: css`
    color: inherit;
    text-decoration: none;
    &:hover {
      color: var(--color-primary-dark);
    }
  `,
  postedAt: css`
    color: var(--color-dark-text-medium);
    display: block;
    font-size: var(--font-size-body3);
  `,
  title: css`
    font-size: var(--font-size-headline);
    line-height: 1.25;
    margin-top: 8px;
  `,
  reactions: css`
    align-items: center;
    display: flex;
    margin-top: 8px;
  `,
  reactionIcon: css`
    color: var(--color-dark-text-medium);
    font-size: var(--font-size-body1);
  `,
  reactionCount: css`
    font-size: var(--font-size-body2);
    margin-left: 8px;
  `,
  button: css`
    margin-left: auto;
  `,
}
