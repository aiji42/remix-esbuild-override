import { renameSync, symlinkSync, mkdirSync } from "node:fs";
import { resolvePath, restartOnce } from "./utils";

const esbuildOverrideMainPath = "remix-esbuild-override/dist/index.js";

export const replaceEsbuild = () => {
  const isOverridden = resolvePath("esbuild").endsWith(esbuildOverrideMainPath);
  if (isOverridden) {
    console.log(
      "💽 esbuild has already been replaced. Your custom config can be used to build for Remix"
    );
  } else {
    const [originalEsbuildPath] =
      resolvePath("esbuild").match(/^.*\/esbuild/) ?? [];
    const [esbuildOverridePath] =
      resolvePath("remix-esbuild-override").match(
        /^.*\/remix-esbuild-override/
      ) ?? [];

    const replacedOriginalEsbuildPath = originalEsbuildPath.replace(
      /esbuild$/,
      "esbuild-org"
    );

    renameSync(originalEsbuildPath, replacedOriginalEsbuildPath);
    symlinkSync(esbuildOverridePath, originalEsbuildPath);
    mkdirSync(`${esbuildOverridePath}/bin`);
    symlinkSync(
      `${replacedOriginalEsbuildPath}/bin/esbuild`,
      `${esbuildOverridePath}/bin/esbuild`
    );

    console.log(
      "💽 Replaced esbuild. Your custom config can be used to build for Remix"
    );

    restartOnce();
  }
};
