export const mods = ["@remix-run/dev/node_modules/esbuild", "esbuild"];
export const defProPattern = /__defProp = Object\.defineProperty;/;
export const defPropRedefine = `__defProp = (a, b, c) => Object.defineProperty(a, b, { ...c, configurable: true });`;
