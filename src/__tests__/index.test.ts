import { build, withEsbuildOverride } from "../index";
import * as Esbuild from "esbuild-org";

vi.mock("esbuild-org", () => ({
  build: vi.fn(),
}));
vi.mock("../replace", () => ({
  replaceEsbuild: vi.fn(),
}));

describe("index", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("build", () => {
    const mock = vi.spyOn(Esbuild, "build");
    beforeAll(() => {
      withEsbuildOverride((option, { isServer, isDev }) => {
        // @ts-ignore
        option.runtime = isServer ? "server" : "browser";
        // @ts-ignore
        option.mode = isDev ? "development" : "production";
        return option;
      });
    });

    test("production/browser", async () => {
      await build({});

      expect(mock).toBeCalledWith({ mode: "production", runtime: "browser" });
    });

    test("production/server", async () => {
      await build({ write: false });

      expect(mock).toBeCalledWith({
        mode: "production",
        runtime: "server",
        write: false,
      });
    });

    test("development/browser", async () => {
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
