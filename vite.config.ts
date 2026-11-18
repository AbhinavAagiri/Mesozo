import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveSiteUrlFromEnv } from './scripts/site-url.mjs';

const DEFAULT_CORRECTION_EMAIL = 'aagiriabhinav2@gmail.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), '');
  const env = { ...fileEnv, ...process.env };
  const { siteUrl, configured } = resolveSiteUrlFromEnv(env);

  if (!configured) {
    console.warn(
      'SEO: no SITE_URL supplied. Building a LOCAL PREVIEW with a loopback canonical and noindex metadata. ' +
        'Use `npm run build:release` with SITE_URL for a deployable artifact.',
    );
  }

  const correctionEmail = (
    env.CORRECTION_EMAIL ||
    env.VITE_CORRECTION_EMAIL ||
    DEFAULT_CORRECTION_EMAIL
  ).trim();
  if (correctionEmail && !EMAIL_PATTERN.test(correctionEmail)) {
    throw new Error(
      `CORRECTION_EMAIL must be a valid email address or empty (received "${correctionEmail}").`,
    );
  }

  return {
    plugins: [react()],
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
      __SITE_INDEXABLE__: JSON.stringify(configured),
      __CORRECTION_EMAIL__: JSON.stringify(correctionEmail),
    },
    build: {
      assetsInlineLimit: 0,
    },
  };
});
