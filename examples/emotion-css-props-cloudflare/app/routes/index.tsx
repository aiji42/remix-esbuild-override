import { css } from "@emotion/react";
import { Link } from "@remix-run/react";

const style = css`
  font-family: system-ui, sans-serif;
  line-height: 1.4;
  background-color: #ddd;
`;

export default function Index() {
  return (
    <div css={style}>
      <h1>Welcome to Remix with Emotion Example</h1>
      <ul>
        <li>
          <Link to="/jokes">Jokes</Link>
        </li>
        <li>
          <Link to="/jokes-error">Jokes: Error</Link>
        </li>
      </ul>
    </div>
  );
}
