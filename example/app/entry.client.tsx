import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const cache = createCache({ key: "css" });

hydrate(
  <CacheProvider value={cache}>
    <RemixBrowser />
  </CacheProvider>,
  document
);
