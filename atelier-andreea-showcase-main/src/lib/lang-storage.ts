import type { Lang } from "@/lib/i18n";

export const LANG_STORAGE_KEY = "lang";
export const LANG_COOKIE_NAME = "lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLang(value: string | null | undefined): value is Lang {
  return value === "en" || value === "ro";
}

export function parseLangFromCookie(cookieHeader: string | null | undefined): Lang | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)lang=(en|ro)(?:;|$)/);
  return isLang(match?.[1]) ? match[1] : null;
}

export function readStoredLang(): Lang | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    return isLang(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function persistLang(lang: Lang) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.cookie = `${LANG_COOKIE_NAME}=${lang};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
    document.documentElement.lang = lang;
  } catch {
    /* ignore quota / private mode */
  }
}

/** Runs in <head> before paint — mirrors localStorage into cookie so SSR matches on the next load. */
export const LANG_BOOTSTRAP_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )lang=(en|ro)/);var l=m?m[1]:localStorage.getItem("lang");if((l==="en"||l==="ro")&&!m)document.cookie="lang="+l+";path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax";}catch(e){}})();`;
