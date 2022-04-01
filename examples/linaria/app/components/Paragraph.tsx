import { ReactNode } from "react";
import { css } from "@linaria/core";

const style = css`
  color: #0074d9;
  font-weight: bold;
`;

export const Paragraph = ({ children }: { children: ReactNode }) => {
  return <p className={style}>{children}</p>;
};

export const ParagraphStyle = __linariaStyle;
