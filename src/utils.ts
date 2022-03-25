export const resolvePath = (moduleName: string) => {
  return require.resolve(moduleName);
};
