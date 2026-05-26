/** Global preview mode: `only` = always mocks, `off` = never, default = mocks when DB is empty. */
export function shouldUseSiteMocks(dbCount: number): boolean {
  const mode =
    import.meta.env.VITE_SITE_MOCKS ??
    import.meta.env.VITE_EXHIBITION_MOCKS;
  if (mode === "only") return true;
  if (mode === "off") return false;
  return dbCount === 0;
}

export function isMockId(id: string, prefix: string): boolean {
  return id.startsWith(prefix);
}
