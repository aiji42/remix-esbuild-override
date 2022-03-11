export * from "esbuild-org";
import { build as buildOrg, BuildOptions } from "esbuild-org";

type BrowserBuildOption = BuildOptions;
type ServerBuildOption = BuildOptions & { write: false };

export const build = async (option: BrowserBuildOption | ServerBuildOption) => {
  const isServer = option.write === false;
  console.log("debug: isServer ", isServer);
  return buildOrg(option);
};
