import { build } from "../index";
import fs from "fs-extra";
import path from "path";
import * as Esbuild from "esbuild-org";

const tempPath = path.join(__dirname, "../..", "tmp");
const oldEnv = { ...process.env };

vi.mock("esbuild-org", () => ({
  build: vi.fn(),
}));

describe("index", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...oldEnv, REMIX_ROOT: tempPath.toString() };
    fs.mkdirSync(tempPath);
    fs.writeFileSync(
      path.join(tempPath, "remix.config.js"),
      `
      module.exports = {
        esbuildOverride: (option, { isServer, isDev }) => {
          option.runtime = isServer ? "server" : "browser"
          option.mode = isDev ? "development" : "production"
          return option
        }
      }
    `
    );
  });
  afterEach(() => {
    process.env = oldEnv;
    fs.removeSync(tempPath);
  });

  test("build", async () => {
    const mock = vi.spyOn(Esbuild, "build");
    await build({});

    expect(mock).toBeCalledWith({ mode: "production", runtime: "browser" });
  });
});
