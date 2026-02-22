/**
 * Application-wide constants.
 */

/** Base URL for the API. Uses Vite proxy in development. */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string || '/api';

/** Query key factory for TanStack Query cache management */
export const QUERY_KEYS = {
  /** All release-related queries */
  releases: {
    all: ['releases'] as const,
    detail: (id: string) => ['releases', id] as const,
    steps: ['releases', 'steps'] as const,
  },
} as const;

/** Stale time for queries (5 minutes) */
export const STALE_TIME = 5 * 60 * 1000;

/** Application route paths */
export const ROUTES = {
  HOME: '/',
  RELEASE_DETAIL: '/releases/:id',
} as const;
