import { withEsbuildOverride, esbuildOverrideOption } from "../index";
import * as utils from "../utils";

vi.mock("../utils");

describe("index", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("esbuildOverrideOption", () => {
    beforeAll(() => {
      vi.spyOn(utils, "load").mockReturnValue(null);
      withEsbuildOverride((option, { isServer, isDev }) => {
        // @ts-ignore
        option.runtime = isServer ? "server" : "browser";
        // @ts-ignore
        option.mode = isDev ? "development" : "production";
        return option;
      });
    });

    test("production/browser", () => {
      expect(esbuildOverrideOption({})).toEqual({
        mode: "production",
        runtime: "browser",
      });
    });

    test("production/server", () => {
      expect(esbuildOverrideOption({ write: false })).toEqual({
        mode: "production",
        runtime: "server",
        write: false,
      });
    });

    test("development/browser", () => {
      expect(
        esbuildOverrideOption({
          define: { "process.env.NODE_ENV": "development" },
        })
      ).toEqual({
        mode: "development",
        runtime: "browser",
        define: { "process.env.NODE_ENV": "development" },
      });
    });

    test("development/server", () => {
      expect(
        esbuildOverrideOption({
          write: false,
          define: { "process.env.NODE_ENV": "development" },
        })
      ).toEqual({
        mode: "development",
        runtime: "server",
        write: false,
        define: { "process.env.NODE_ENV": "development" },
      });
    });
  });

  describe("withEsbuildOverride", () => {
    let esbuild: any;
    let mockedBuildFunction = vi.fn();
    beforeAll(() => {
      vi.spyOn(utils, "load").mockImplementation((mod) => {
        if (mod === "@remix-run/dev/node_modules/esbuild") return esbuild;
        return null;
      });
    });

    test("override esbuild.build", () => {
      esbuild = { build: mockedBuildFunction };
      withEsbuildOverride((option) => {
        option.jsxFactory = "jsx";
        return option;
      });
      esbuild.build({ foo: "bar" });

      expect(mockedBuildFunction).toBeCalledWith({
        foo: "bar",
        jsxFactory: "jsx",
      });
      expect(esbuild.overridden).toEqual(true);
    });

    test("esbuild has already been overwritten", () => {
      esbuild = { build: mockedBuildFunction, overridden: true };
      withEsbuildOverride((option) => {
        option.jsxFactory = "jsx";
        return option;
      });
      esbuild.build({ foo: "bar" });

      expect(mockedBuildFunction).toBeCalledWith({
        foo: "bar",
      });
      expect(esbuild.overridden).toEqual(true);
    });
  });
});
