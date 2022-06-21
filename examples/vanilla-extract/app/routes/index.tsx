import { Paragraph, links as paragraphLinks } from "~/components/Paragraph";

// import * as styles from './index.css'

export const links = () => [
  ...paragraphLinks(),
];

export default function Index() {
  return (
    <div>
      <h1>Welcome to Remix</h1>
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