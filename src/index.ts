export * from "esbuild-org";
export { replaceEsbuild } from "./replace";
import { build as buildOrg, BuildOptions } from "esbuild-org";
import { resolve } from "path";
import { AppConfig as AppConfigOrg } from "@remix-run/dev";

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

export type AppConfig = AppConfigOrg & {
  esbuildOverride?: EsbuildOverride;
};

export const build = async (option: EsbuildOption) => {
  const esbuildOverride = readEsbuildOverride();
  const isServer = option.write === false;
  const isDev = option.define?.["process.env.NODE_ENV"] === "development";
  return buildOrg(esbuildOverride(option, { isServer, isDev }));
};

const noOp: EsbuildOverride = (arg: BuildOptions) => arg;

const readEsbuildOverride = (): EsbuildOverride => {
  const remixRoot = process.env.REMIX_ROOT || process.cwd();

  const rootDirectory = resolve(remixRoot);
  const configFile = resolve(rootDirectory, "remix.config.js");

  try {
    const config = require(configFile);
    return config.esbuildOverride ?? noOp;
  } catch (error) {
    throw new Error(`Error loading Remix config in ${configFile}`);
  }
};
