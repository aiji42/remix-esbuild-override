import { fs, vol } from "memfs";
import { patching } from "../patching";
import * as utils from "../utils";

const esbuildMainJs = `
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
`;

vi.mock("../utils");
vi.mock("fs", () => fs);
// const mockedConsoleLog = vi.spyOn(console, "log");

beforeEach(() => {
  vol.reset();
});
afterEach(() => {
  vi.resetAllMocks();
});

test("Only esbuild directly under node_modules", () => {
  vol.fromJSON(
    {
      "./node_modules/esbuild/package.json":
        '{ "name": "esbuild", "main": "lib/main.js" }',
      "./node_modules/esbuild/lib/main.js": esbuildMainJs,
    },
    "/app"
  );
  vi.spyOn(utils, "resolve").mockImplementation((mod) => {
    if (mod === "esbuild") return "/app/node_modules/esbuild/lib/main.js";
    return null;
  });

  patching();

  expect(vol.toJSON()).toMatchSnapshot();
});

test("Only esbuild under @remix-run/dev", () => {
  vol.fromJSON(
    {
      "./node_modules/@remix-run/dev/node_modules/esbuild/package.json":
        '{ "name": "esbuild", "main": "lib/main.js" }',
      "./node_modules/@remix-run/dev/node_modules/esbuild/lib/main.js":
        esbuildMainJs,
    },
    "/app"
  );
  vi.spyOn(utils, "resolve").mockImplementation((mod) => {
    if (mod === "@remix-run/dev/node_modules/esbuild")
      return "/app/node_modules/@remix-run/dev/node_modules/esbuild/lib/main.js";
    return null;
  });

  patching();

  expect(vol.toJSON()).toMatchSnapshot();
});

test("esbuild exists in both", () => {
  vol.fromJSON(
    {
      "./node_modules/esbuild/package.json":
        '{ "name": "esbuild", "main": "lib/main.js" }',
      "./node_modules/esbuild/lib/main.js": esbuildMainJs,
      "./node_modules/@remix-run/dev/node_modules/esbuild/package.json":
        '{ "name": "esbuild", "main": "lib/main.js" }',
      "./node_modules/@remix-run/dev/node_modules/esbuild/lib/main.js":
        esbuildMainJs,
    },
    "/app"
  );
  vi.spyOn(utils, "resolve").mockImplementation((mod) => {
    if (mod === "@remix-run/dev/node_modules/esbuild")
      return "/app/node_modules/@remix-run/dev/node_modules/esbuild/lib/main.js";
    return null;
  });

  patching();

  expect(vol.toJSON()).toMatchSnapshot();
});

test("defProPattern missing from script", () => {
  vol.fromJSON(
    {
      "./node_modules/esbuild/package.json":
        '{ "name": "esbuild", "main": "lib/main.js" }',
      "./node_modules/esbuild/lib/main.js": "",
    },
    "/app"
  );
  vi.spyOn(utils, "resolve").mockImplementation((mod) => {
    if (mod === "esbuild") return "/app/node_modules/esbuild/lib/main.js";
    return null;
  });

  expect(() => patching()).toThrowError(
    /esbuild patch by remix-esbuild-override failed/
  );
});
