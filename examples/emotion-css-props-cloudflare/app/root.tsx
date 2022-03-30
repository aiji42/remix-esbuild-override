import type { MetaFunction } from "remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import { useContext, useEffect } from "react";
import { withEmotionCache, css } from "@emotion/react";
import ServerStyleContext from "./styles/server.context";
import ClientStyleContext from "./styles/client.context";

const style = css`
  background-color: #ff0000;
  padding: 1em;
`;

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix with Emotion",
  viewport: "width=device-width,initial-scale=1",
});

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;

      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });

      // reset cache to re-apply global styles
      clientStyleData.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div css={style}>
        <p>
          [CatchBoundary]: {caught.status} {caught.statusText}
        </p>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <div css={style}>
        <p>[ErrorBoundary]: There was an error: {error.message}</p>
      </div>
    </Document>
  );
}
