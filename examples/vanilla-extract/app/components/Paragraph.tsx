import { ReactNode } from "react";

import * as styles from './Paragraph.css'

export const Paragraph = ({ children }: { children: ReactNode }) => {
  return <p className={styles.container}>{children}</p>;
};

export const links = () => __vanillaStyle.map((href) => ({
  rel: 'stylesheet',
  href,
}));
