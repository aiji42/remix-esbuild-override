import { Link } from "@remix-run/react";
import { css } from "@emotion/react";

const style = css`
  background-color: #d6d6d6;
`;

export default function Jokes() {
  return (
    <div css={style}>
      <h1>Jokes</h1>
      <p>This route works fine.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}
