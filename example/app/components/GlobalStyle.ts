import { css } from "@emotion/react"

export const globalStyles = css`
  :root {
    --color-surface: #fff;
    --color-background: #f6f6f6;
    --color-primary: #6002ee;
    --color-primary-dark: #3d00e0;
    --color-dark-text-high: rgba(0, 0, 0, 0.87);
    --color-dark-text-medium: rgba(0, 0, 0, 0.6);
    --color-light-text-high: rgba(255, 255, 255, 0.87);
    --font-size-headline: 22px;
    --font-size-subhead: 20px;
    --font-size-body1: 16px;
    --font-size-body2: 14px;
    --font-size-body3: 12px;
    --width-contents: 1136px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    color: var(--color-dark-text-high);
    font-family: "Noto Sans JP", sans-serif;
    font-size: var(--font-size-body1);
    line-height: 1.5;
    height: 100%;
  }

  body {
    background-color: var(--color-background);
    height: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    font-size: inherit;
  }

  button {
    background-color: inherit;
    border: none;
    cursor: pointer;
    line-height: 1.5;
  }

  img {
    max-width: 100%;
  }

  small {
    font-size: inherit;
  }
`
