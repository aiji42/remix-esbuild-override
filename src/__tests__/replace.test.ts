import { fs, vol } from "memfs";
import * as utils from "../utils";
import { replaceEsbuild } from "../replace";

vi.mock("../utils");
vi.mock("fs", () => fs);
const mockedConsoleLog = vi.spyOn(console, "log");

beforeEach(() => {
  vi.spyOn(utils, "restartOnce").mockImplementation(vi.fn());
  vol.reset();
});
afterEach(() => {
  vi.resetAllMocks();
});

test("replace esbuild by remix-esbuild-override", () => {
  vi.spyOn(utils, "resolvePath").mockImplementation((moduleName) => {
    if (moduleName === "esbuild")
      return "/app/node_modules/esbuild/lib/main.js";
    if (moduleName === "remix-esbuild-override")
      return "/app/node_modules/remix-esbuild-override/dist/index.js";
    return "";
  });
  vol.fromJSON(
    {
      "./node_modules/esbuild/package.json":
        '{ "name": "esbuild", "main": "lib/main.js" }',
      "./node_modules/esbuild/lib/main.js": `this is original main`,
      "./node_modules/esbuild/bin/esbuild": `this is original binary`,
      "./node_modules/remix-esbuild-override/package.json": `{ "name": "remix-esbuild-override", "main": "dist/index.js" }`,
      "./node_modules/remix-esbuild-override/dist/index.js": `this is replaced main`,
    },
    "/app"
  );

  replaceEsbuild();

  expect(
    vol.readFileSync("/app/node_modules/esbuild/dist/index.js", "utf8")
  ).toEqual("this is replaced main");
  expect(
    vol.readFileSync("/app/node_modules/esbuild/bin/esbuild", "utf8")
  ).toEqual("this is original binary");
  expect(vol.toJSON()).toMatchSnapshot();

  expect(mockedConsoleLog).toBeCalledWith(
    expect.stringMatching(/Replaced esbuild/)
  );
});

test("already replaced", () => {
  vi.spyOn(utils, "resolvePath").mockReturnValue(
    "node_modules/remix-esbuild-override/dist/index.js"
  );

  replaceEsbuild();
  expect(mockedConsoleLog).toBeCalledWith(
    expect.stringMatching(/esbuild has already been replaced/)
  );
});
