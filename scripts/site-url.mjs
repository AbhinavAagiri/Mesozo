export const LOCAL_SITE_URL = 'http://127.0.0.1:4173';
export const RELEASE_ENV = 'MESOZO_RELEASE';

const LOCAL_HOSTS = new Set(['localhost', '0.0.0.0', '127.0.0.1', '::1', '[::1]']);

function isPrivateHost(hostname) {
  if (LOCAL_HOSTS.has(hostname)) return true;
  if (hostname.endsWith('.localhost') || hostname.endsWith('.local')) return true;
  if (/^10\./.test(hostname) || /^192\.168\./.test(hostname)) return true;
  const private172 = hostname.match(/^172\.(\d{1,3})\./);
  return Boolean(private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31);
}

/**
 * Resolve SITE_URL / VITE_SITE_URL to the canonical public origin.
 *
 * A release build must supply an explicit, public HTTPS origin. There is no
 * production placeholder: missing configuration fails `build:release`.
 *
 * A local build may omit the origin. It then receives a loopback canonical and
 * is marked noindex by the SEO generator, so it can be previewed without ever
 * looking like a deployable production site.
 */
export function resolveSiteUrl(rawValue, { release = false } = {}) {
  const value = rawValue?.trim();
  if (!value) {
    if (release) {
      throw new Error(
        'MESOZO release build requires SITE_URL. Set SITE_URL to the public HTTPS origin ' +
          '(for example: SITE_URL=https://mesozo.example npm run build:release). ' +
          'No production placeholder is used.',
      );
    }
    return { siteUrl: LOCAL_SITE_URL, configured: false, mode: 'local' };
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `Invalid site URL "${value}". Set SITE_URL to an HTTPS origin with no path, query or fragment, such as https://mesozo.example.`,
    );
  }

  if (url.protocol !== 'https:') {
    throw new Error(
      `SITE_URL must use HTTPS (received "${value}"). Set it to the public HTTPS origin.`,
    );
  }
  if (isPrivateHost(url.hostname)) {
    throw new Error(
      `SITE_URL must not point to a local or private host (received "${value}").`,
    );
  }
  if (url.username || url.password) {
    throw new Error('SITE_URL must not contain credentials.');
  }
  if (url.port) {
    throw new Error(`SITE_URL must not include a custom port (received "${value}").`);
  }
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(
      `SITE_URL must be an origin only, without a path, query or hash (received "${value}").`,
    );
  }

  return { siteUrl: url.origin, configured: true, mode: 'release' };
}

export function resolveSiteUrlFromEnv(env = process.env, options = {}) {
  const release = options.release ?? env[RELEASE_ENV] === '1';
  return resolveSiteUrl(env.SITE_URL || env.VITE_SITE_URL, { release });
}
