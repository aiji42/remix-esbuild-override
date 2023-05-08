import { withEsbuildOverride, esbuildOverrideOption } from "../index";
import * as utils from "../utils";
import { beforeEach, describe, test } from "vitest";

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

    test("defined invalid callback", () => {
      // @ts-ignore
      withEsbuildOverride(() => {});

      expect(() => esbuildOverrideOption({})).toThrowError(
        /The callback function withEsbuildOverride must return the esbuild option value/
      );
    });
  });

  describe("withEsbuildOverride", () => {
    let esbuild: any;
    let mockedBuildFunction = vi.fn();
    let mockedContextFunction = vi.fn();
    beforeEach(() => {
      esbuild = undefined;
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

    test("override esbuild.context", () => {
      esbuild = { context: mockedContextFunction };
      withEsbuildOverride((option) => {
        option.jsxFactory = "jsx";
        return option;
      });
      esbuild.context({ foo: "bar" });

      expect(mockedContextFunction).toBeCalledWith({
        foo: "bar",
        jsxFactory: "jsx",
      });
      expect(esbuild.overridden).toEqual(true);
    });

    test("esbuild has already been overwritten", () => {
      esbuild = {
        build: mockedBuildFunction,
        context: mockedContextFunction,
        overridden: true,
      };
      withEsbuildOverride((option) => {
        option.jsxFactory = "jsx";
        return option;
      });
      esbuild.build({ foo: "bar" });
      esbuild.context({ foo: "bar" });

      expect(mockedBuildFunction).toBeCalledWith({
        foo: "bar",
      });
      expect(mockedContextFunction).toBeCalledWith({
        foo: "bar",
      });
      expect(esbuild.overridden).toEqual(true);
    });

    test("Unable to override esbuild", () => {
      const obj = {};
      Object.defineProperty(obj, "build", { get: () => mockedBuildFunction });
      vi.spyOn(utils, "load").mockReturnValue(obj);
      const mockedConsole = vi.spyOn(console, "error");
      expect(() => withEsbuildOverride((option) => option)).toThrowError(
        /Override of esbuild failed/
      );
      expect(mockedConsole).toBeCalledWith(
        expect.stringMatching(/Override of esbuild failed/)
      );
    });

    test("not defined callback", () => {
      const mockedConsole = vi.spyOn(console, "warn");
      withEsbuildOverride();
      expect(mockedConsole).toBeCalledWith(
        expect.stringMatching(/esbuild is not overridden/)
      );
    });
  });
});
