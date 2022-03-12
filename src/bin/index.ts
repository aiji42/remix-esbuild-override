#!/usr/bin/env node
import { execSync } from "node:child_process";

const isOverridden = require
  .resolve("esbuild")
  .endsWith("remix-esbuild-override/dist/index.js");
if (isOverridden) {
  console.log(
    "esbuild has already been replaced. Your custom config can be used to build for Remix💡"
  );
} else {
  const [originalEsbuildPath] =
    require.resolve("esbuild").match(/^.*\/esbuild/) ?? [];
  const [linkedEsbuildPath] =
    require
      .resolve("remix-esbuild-override")
      .match(/^.*\/remix-esbuild-override/) ?? [];

  execSync(
    `mv ${originalEsbuildPath} ${originalEsbuildPath.replace(
      /esbuild$/,
      "esbuild-org"
    )}`
  );

  execSync(`ln -s ${linkedEsbuildPath} ${originalEsbuildPath}`);

  console.log(
    "Replaced esbuild. Your custom config can be used to build for Remix💡"
  );
}
