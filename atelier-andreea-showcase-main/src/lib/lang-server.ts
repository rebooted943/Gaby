import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import type { Lang } from "@/lib/i18n";
import { parseLangFromCookie } from "@/lib/lang-storage";

export const getServerLang = createServerOnlyFn((): Lang => {
  const cookie = getRequestHeader("cookie");
  return parseLangFromCookie(cookie) ?? "en";
});
