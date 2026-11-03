import { RequestHandler } from 'express';

/**
 * Lets CDNs / proxies / the app cache public, non-personalised responses.
 * Short max-age keeps menus fresh; stale-while-revalidate hides refetch latency.
 */
export const cachePublic =
  (maxAgeSeconds = 60): RequestHandler =>
  (_req, res, next) => {
    res.set(
      'Cache-Control',
      `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 5}`,
    );
    next();
  };
