export declare const LOCAL_SITE_URL: string;
export declare const RELEASE_ENV: string;

export declare function resolveSiteUrl(
  rawValue?: string,
  options?: { release?: boolean },
): {
  siteUrl: string;
  configured: boolean;
  mode: 'local' | 'release';
};

export declare function resolveSiteUrlFromEnv(
  env?: Record<string, string | undefined>,
  options?: { release?: boolean },
): {
  siteUrl: string;
  configured: boolean;
  mode: 'local' | 'release';
};
