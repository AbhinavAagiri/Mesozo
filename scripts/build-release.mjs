#!/usr/bin/env node
/**
 * Guarded release build.
 *
 * The public origin must be supplied explicitly. There is deliberately no
 * Pages-style domain or other production fallback: a release command without
 * SITE_URL stops before Vite or the SEO generator can write misleading URLs.
 */
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { loadEnv } from 'vite';
import { resolveSiteUrlFromEnv } from './site-url.mjs';

const root = process.cwd();
const env = { ...loadEnv('production', root, ''), ...process.env };
let siteUrl;

try {
  ({ siteUrl } = resolveSiteUrlFromEnv(env, { release: true }));
} catch (error) {
  console.error(`\nMESOZO release build blocked.\n${error.message}\n`);
  console.error('Owner action: set SITE_URL in the Cloudflare Pages environment and rerun `npm run build:release`.');
  process.exit(1);
}

console.log(`Release build origin: ${siteUrl}`);
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
  cwd: root,
  env: {
    ...process.env,
    ...env,
    MESOZO_RELEASE: '1',
    SITE_URL: siteUrl,
  },
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
