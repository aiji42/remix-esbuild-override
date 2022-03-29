import { BuildOptions, build } from "esbuild";
import { load } from "./utils";
import { mods } from "./constants";

type BrowserBuildOption = BuildOptions;
type ServerBuildOption = BuildOptions & { write: false };
type EsbuildOption = BrowserBuildOption | ServerBuildOption;
/**
 * @property {boolean} isServer - Whether the esbuild call is for server-side
 * @property {boolean} isDev - Whether the esbuild call is for a development
 */
type EsbuildContext = {
  isServer: boolean;
  isDev: boolean;
};

/**
 * @callback EsbuildOverride
 * @param {EsbuildOption} option - Default option values to be used when remix calls esbuild
 * @param {EsbuildContext} context - @see {@link EsbuildContext}
 * @return {EsbuildOption} - Return the option values you override
 */
export type EsbuildOverride = (
  option: EsbuildOption,
  context: EsbuildContext
) => EsbuildOption;

let _esbuildOverride: EsbuildOverride = (arg) => arg;

/**
 * This is a function to override esbuild; add it to remix.config.js.
 * @param {EsbuildOverride} esbuildOverride - callback function
 */
export const withEsbuildOverride = (esbuildOverride?: EsbuildOverride) => {
  if (typeof esbuildOverride !== "function") {
    console.warn(
      "💽 esbuild is not overridden because no callback function is defined"
    );
    return;
  }
  _esbuildOverride = esbuildOverride;

  for (const mod of mods) {
    const esbuild = load<{ overridden?: boolean; build: typeof build }>(mod);
    if (!esbuild) continue;

    if (esbuild.overridden) break;
    const originalBuildFunction = esbuild.build;
    try {
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
    } catch {
      throw new Error(
        "❌ Override of esbuild failed. Check if postinstall has mix-esbuild-override set. See: https://github.com/aiji42/remix-esbuild-override#install"
      );
    }
    console.log(
      "💽 Override esbuild. Your custom config can be used to build for Remix."
    );
    break;
  }
};

export const esbuildOverrideOption = (option: EsbuildOption) => {
  const isServer = option.write === false;
  const isDev = option.define?.["process.env.NODE_ENV"] === "development";
  const newOption = _esbuildOverride(option, { isServer, isDev });
  if (!newOption) {
    throw new Error(
      "❌ The callback function withEsbuildOverride must return the esbuild option value."
    );
  }
  return newOption;
};
