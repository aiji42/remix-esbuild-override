import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from "@emotion/cache";

const cache = createCache({ key: "css" });
const { extractCriticalToChunks, constructStyleTagsFromChunks } =
  createEmotionServer(cache);

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <CacheProvider value={cache}>
      <RemixServer context={remixContext} url={request.url} />
    </CacheProvider>
  );

  const chunks = extractCriticalToChunks(markup);
  const styles = constructStyleTagsFromChunks(chunks);

  responseHeaders.set("Content-Type", "text/html");

  return new Response(
    "<!DOCTYPE html>" + markup.replace("</head>", styles + "</head>"),
    {
      status: responseStatusCode,
      headers: responseHeaders,
    }
  );
}
