import { useEffect, useState } from "react";

const HERO_SESSION_KEY = "hero-entered";

function readHeroEntered(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(HERO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/** Hero entrance animations run only once per browser tab session. */
export function useHeroEntered() {
  const [ready, setReady] = useState(readHeroEntered);

  useEffect(() => {
    if (ready) return;
    const id = window.setTimeout(() => {
      try {
        sessionStorage.setItem(HERO_SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setReady(true);
    }, 4000);
    return () => window.clearTimeout(id);
  }, [ready]);

  return ready;
}
