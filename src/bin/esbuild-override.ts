#! /usr/bin/env node
import * as fs from "fs";

const pattern = /__defProps = Object\.defineProperties;/;
const redefine = `__defProp = (a, b, c) => Object.defineProperty(a, b, { ...c, configurable: true });`;

const main = () => {
  for (const mod of ["@remix-run/dev/node_modules/esbuild", "esbuild"]) {
    let path: string;
    try {
      path = require.resolve(mod);
    } catch (_) {
      continue;
    }
    const original = fs.readFileSync(path, { encoding: "utf8" });
    if (original.includes(redefine)) break;
    if (!original.match(pattern)) throw new Error();
    const patched = original.replace(pattern, `$&${redefine}`);
    fs.writeFileSync(path, patched);
    break;
  }
};
main();
