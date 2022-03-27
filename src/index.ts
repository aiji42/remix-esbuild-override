export * from "esbuild-org";
import { build as buildOrg, BuildOptions } from "esbuild-org";
import { replaceEsbuild } from "./replace";

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

export const withEsbuildOverride = (_esbuildOverride: EsbuildOverride) => {
  replaceEsbuild();
  if (typeof _esbuildOverride === "function")
    esbuildOverride = _esbuildOverride;
};

export const build = async (option: EsbuildOption) => {
  const isServer = option.write === false;
  const isDev = option.define?.["process.env.NODE_ENV"] === "development";
  return buildOrg(esbuildOverride(option, { isServer, isDev }));
};
