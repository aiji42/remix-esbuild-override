import { Link } from "@remix-run/react";
import { css } from "@emotion/react";

const style = css`
  background-color: #d6d6d6;
`;

const style2 = css`
  background-color: #d8eaac;
`;

export default function Jokes() {
  return (
    <>
      <div css={style}>
        <h1>Using css props</h1>
        <p>This route works fine.</p>
        <Link to="/">Back to home</Link>
      </div>
      <div>you can use shorthand Fragment ({"<></>"}) without pragma.</div>
    </>
  );
}
