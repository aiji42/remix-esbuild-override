#!/usr/bin/env node
import { replaceEsbuild } from "../replace";

try {
  replaceEsbuild(false);
} catch (e) {
  if (e instanceof Error)
    console.warn("💽 Skipped esbuild replacement:", e.message);
  console.log(
    "💽 Please read https://github.com/aiji42/remix-esbuild-override#if-postinstall-fails"
  );
}
