export const resolve = (mod: string): string | null => {
  try {
    return require.resolve(mod);
  } catch (_) {
    return null;
  }
};

export const load = <T>(mod: string): T | null => {
  try {
    return require(mod) as T;
  } catch (_) {
    return null;
  }
};
