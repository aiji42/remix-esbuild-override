import * as fs from "fs";
import { resolve } from "./utils";

const pattern = /__defProps = Object\.defineProperties;/;
const redefine = `__defProp = (a, b, c) => Object.defineProperty(a, b, { ...c, configurable: true });`;

export const patching = () => {
  for (const mod of ["@remix-run/dev/node_modules/esbuild", "esbuild"]) {
    const path = resolve(mod);
    if (!path) continue;

    const original = fs.readFileSync(path, { encoding: "utf8" });
    if (original.includes(redefine)) {
      console.log("💽 esbuild patch by remix-esbuild-override is complete.");
      break;
    }
    if (!original.match(pattern))
      throw new Error(
        "😵 esbuild patch by remix-esbuild-override failed, please check the the esbuild and remix versions and report this in a new issue. https://github.com/aiji42/remix-esbuild-override/issues/new"
      );
    const patched = original.replace(pattern, `$&${redefine}`);
    fs.writeFileSync(path, patched);
    console.log("💽 esbuild patch by remix-esbuild-override is complete.");
    break;
  }
};
