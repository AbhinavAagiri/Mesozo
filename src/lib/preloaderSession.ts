export const PRELOADER_SESSION_KEY = 'mesozo_preloader_seen';

let cachedDecision: boolean | null = null;

/**
 * The decision is deliberately made once per JavaScript lifetime, before React
 * renders, so StrictMode and component remounts can never schedule it twice.
 * The key is written immediately: a refresh or an in-app navigation in this tab
 * must not replay the sequence.
 */
export function shouldPlayPreloader(): boolean {
  if (cachedDecision !== null) return cachedDecision;

  if (typeof window === 'undefined') {
    cachedDecision = false;
    return cachedDecision;
  }

  try {
    if (window.sessionStorage.getItem(PRELOADER_SESSION_KEY) !== null) {
      cachedDecision = false;
      return cachedDecision;
    }

    window.sessionStorage.setItem(PRELOADER_SESSION_KEY, String(Date.now()));
    cachedDecision = true;
  } catch {
    // Storage may be blocked (private mode, embedded contexts). Showing the
    // sequence once for this app lifetime is a more graceful fallback than
    // failing open into a half-initialised page.
    cachedDecision = true;
  }

  return cachedDecision;
}
