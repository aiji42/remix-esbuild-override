import { css } from "@linaria/core";
import { Paragraph, ParagraphStyle } from "~/components/Paragraph";

export const links = () => [
  { rel: "stylesheet", href: __linariaStyle },
  { rel: "stylesheet", href: ParagraphStyle },
];

const styles = {
  container: css`
    font-family: system-ui, sans-serif;
    line-height: 1.2;
  `,
  header: css`
    color: coral;
  `,
};

export default function Index() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome to Remix</h1>
      <Paragraph>This is example for linaria</Paragraph>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
