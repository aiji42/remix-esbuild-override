import { css } from "@emotion/react";
import { Header } from "~/components/Header";
import { Navigation } from "~/components/Navigation";
import feedItemDataset from "~/datas/dummy-feed-items.json";
import { FeedItem, Data as feedItemDataType } from "~/components/FeedItem";
import rankingDataset from "~/datas/dummy-ranking.json";
import { Ranking } from "~/components/Ranking";
import { Footer } from "~/components/Footer";

export default function Emotion() {
  return (
    <>
      <Header />
      <div css={styles.contents}>
        <Navigation css={styles.navigation} />
        <main css={styles.main}>
          <h2 css={styles.headline}>ホーム</h2>
          {feedItemDataset.map((feedItemData: feedItemDataType) => (
            <FeedItem
              data={feedItemData}
              key={feedItemData.title}
              css={styles.feedItem}
            />
          ))}
        </main>
        <aside css={styles.sidebar}>
          <Ranking dataset={rankingDataset} />
          <Footer css={styles.footer} />
        </aside>
      </div>
    </>
  );
}

const styles = {
  contents: css`
    display: grid;
    grid-column-gap: 16px;
    grid-template-areas: "navigation navigation main main main main main main sidebar sidebar sidebar sidebar";
    grid-template-columns: repeat(12, minmax(48px, 80px));
    justify-content: center;
    padding: 24px 16px 48px;
  `,
  navigation: css`
    align-self: start;
    display: flex;
    flex-direction: column;
    grid-area: navigation;
    position: sticky;
    top: 88px;
  `,
  main: css`
    grid-area: main;
  `,
  headline: css`
    font-size: var(--font-size-subhead);
    font-weight: bold;
  `,
  feedItem: css`
    margin-top: 16px;
  `,
  sidebar: css`
    grid-area: sidebar;
  `,
  footer: css`
    margin-top: 16px;
  `,
};
