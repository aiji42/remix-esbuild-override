import { build } from "../index";
import fs from "fs-extra";
import path from "path";
import * as Esbuild from "esbuild-org";
import { beforeEach, describe } from "vitest";

vi.mock("esbuild-org", () => ({
  build: vi.fn(),
}));

const tempPath = path.join(__dirname, "../..", "tmp");
const oldEnv = { ...process.env };

const prepareConfig = (script: string | undefined) => {
  fs.removeSync(tempPath);
  if (!script) return;
  fs.mkdirSync(tempPath);
  fs.writeFileSync(path.join(tempPath, "remix.config.js"), script);
};

describe("index", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...oldEnv, REMIX_ROOT: tempPath.toString() };
  });
  afterEach(() => {
    process.env = oldEnv;
    fs.removeSync(tempPath);
  });

  describe("build", () => {
    // TODO: need vi.resetModules()
    test.skip("not override", async () => {
      prepareConfig(`
          module.exports = {}
        `);
      const mock = vi.spyOn(Esbuild, "build");
      await build({});

      expect(mock).toBeCalledWith({});
    });

    // TODO: need vi.resetModules()
    test.skip("load config error", async () => {
      prepareConfig(undefined);
      expect(build({})).toThrowError();
    });

    describe("override", () => {
      beforeEach(() => {
        prepareConfig(`
          module.exports = {
            esbuildOverride: (option, { isServer, isDev }) => {
              option.runtime = isServer ? "server" : "browser"
              option.mode = isDev ? "development" : "production"
              return option
            }
          }
        `);
      });

      test("production/browser", async () => {
        const mock = vi.spyOn(Esbuild, "build");
        await build({});

        expect(mock).toBeCalledWith({ mode: "production", runtime: "browser" });
      });

      test("production/server", async () => {
        const mock = vi.spyOn(Esbuild, "build");
        await build({ write: false });

        expect(mock).toBeCalledWith({
          mode: "production",
          runtime: "server",
          write: false,
        });
      });

      test("development/browser", async () => {
        const mock = vi.spyOn(Esbuild, "build");
        await build({
          define: { "process.env.NODE_ENV": "development" },
        });

        expect(mock).toBeCalledWith({
          mode: "development",
          runtime: "browser",
          define: { "process.env.NODE_ENV": "development" },
        });
      });

      test("development/server", async () => {
        const mock = vi.spyOn(Esbuild, "build");
        await build({
          write: false,
          define: { "process.env.NODE_ENV": "development" },
        });

        expect(mock).toBeCalledWith({
          mode: "development",
          runtime: "server",
          write: false,
          define: { "process.env.NODE_ENV": "development" },
        });
      });
    });
  });
});
