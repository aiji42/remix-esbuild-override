import * as fs from "fs";
import { resolve } from "./utils";
import { mods, defProPattern, defPropRedefine } from "./constants";

export const patching = () => {
  for (const mod of mods) {
    const path = resolve(mod);
    if (!path) continue;

    const original = fs.readFileSync(path, { encoding: "utf8" });
    if (original.includes(defPropRedefine)) {
      console.log("💽 esbuild patch by remix-esbuild-override is complete.");
      break;
    }
    if (!original.match(defProPattern))
      throw new Error(
        "❌ esbuild patch by remix-esbuild-override failed, please check the the esbuild and remix versions and report this in a new issue. https://github.com/aiji42/remix-esbuild-override/issues/new"
      );
    const patched = original.replace(defProPattern, `$&\n${defPropRedefine}`);
    fs.writeFileSync(path, patched);
    console.log("💽 esbuild patch by remix-esbuild-override is complete.");
    break;
  }
};
