import React, { ReactNode, ComponentPropsWithRef, forwardRef } from "react"
import { css } from "@emotion/react"

type Props = {
  children: ReactNode
  className?: string
  size?: "m" | "s"
  variant?: "fill" | "border"
} & ComponentPropsWithRef<"button">

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, size = "m", variant = "fill", ...props }, ref) => {
    return (
      <button css={[styles.base, styles[size], styles[variant]]} {...props} ref={ref}>
        {children}
      </button>
    )
  }
)

const styles = {
  base: css`
    border-color: transparent;
    border-radius: 2px;
    border-style: solid;
    border-width: 1px;
    font-weight: bold;
    padding: 7px 15px;
  `,
  m: css`
    font-size: var(--font-size-body1);
  `,
  s: css`
    font-size: var(--font-size-body3);
  `,
  fill: css`
    background-color: var(--color-primary);
    color: var(--color-light-text-high);
    &:hover {
      background-color: var(--color-primary-dark);
    }
  `,
  border: css`
    border-color: var(--color-primary);
    color: var(--color-dark-text-medium);
    &:hover {
      background-color: var(--color-background);
      color: var(--color-dark-text-high);
    }
  `,
}
