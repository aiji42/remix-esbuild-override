import type { BuildOptions } from "esbuild";

type BrowserBuildOption = BuildOptions;
type ServerBuildOption = BuildOptions & { write: false };
type EsbuildOption = BrowserBuildOption | ServerBuildOption;
type EsbuildContext = {
  isServer: boolean;
  isDev: boolean;
};
export type EsbuildOverride = (
  option: EsbuildOption,
  context: EsbuildContext
) => EsbuildOption;

let esbuildOverride: EsbuildOverride = (arg) => arg;

export const withEsbuildOverride = (_esbuildOverride?: EsbuildOverride) => {
  if (typeof _esbuildOverride !== "function") return;
  esbuildOverride = _esbuildOverride;

  for (const mod of ["esbuild", "@remix-run/dev/node_modules/esbuild"]) {
    let esbuild;
    try {
      esbuild = require(mod);
    } catch (_) {
      continue;
    }
    if (esbuild && !esbuild.overridden) break;
    const originalBuildFunction = esbuild.build;
    Object.defineProperty(esbuild, "build", {
      get: () => (option: EsbuildOption) => {
        return originalBuildFunction(makeNewOption(option));
      },
      enumerable: true,
    });
    Object.defineProperty(esbuild, "overridden", {
      value: true,
      enumerable: true,
    });
    break;
  }
};

const makeNewOption = (option: EsbuildOption) => {
  const isServer = option.write === false;
  const isDev = option.define?.["process.env.NODE_ENV"] === "development";
  return esbuildOverride(option, { isServer, isDev });
};
