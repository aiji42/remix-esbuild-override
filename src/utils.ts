import { spawn } from "node:child_process";

export const resolvePath = (moduleName: string) => {
  return require.resolve(moduleName);
};

export const restartOnce = () => {
  if (process.env.restarting)
    throw new Error("An unexpected error has occurred.");

  console.log("💽 Auto restarting precess...");
  spawn(process.argv[0], process.argv.slice(1), {
    env: { restarting: "true" },
    stdio: "ignore",
  }).unref();
};
