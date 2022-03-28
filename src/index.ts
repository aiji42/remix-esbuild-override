import { BuildOptions, build } from "esbuild";
import * as console from "console";
import { load } from "./utils";

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

  for (const mod of ["@remix-run/dev/node_modules/esbuild", "esbuild"]) {
    const esbuild = load<{ overridden?: boolean; build: typeof build }>(mod);
    if (!esbuild) continue;

    if (esbuild.overridden) break;
    const originalBuildFunction = esbuild.build;
    Object.defineProperty(esbuild, "build", {
      get: () => (option: EsbuildOption) => {
        return originalBuildFunction(esbuildOverrideOption(option));
      },
      enumerable: true,
    });
    Object.defineProperty(esbuild, "overridden", {
      value: true,
      enumerable: true,
    });
    console.log(
      "💽 Override esbuild. Your custom config can be used to build for Remix."
    );
    break;
  }
};

export const esbuildOverrideOption = (option: EsbuildOption) => {
  const isServer = option.write === false;
  const isDev = option.define?.["process.env.NODE_ENV"] === "development";
  return esbuildOverride(option, { isServer, isDev });
};
