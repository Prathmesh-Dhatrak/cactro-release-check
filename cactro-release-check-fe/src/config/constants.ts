export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string || '/api';

export const QUERY_KEYS = {
  releases: {
    all: ['releases'] as const,
    detail: (id: string) => ['releases', id] as const,
    steps: ['releases', 'steps'] as const,
  },
} as const;

export const STALE_TIME = 5 * 60 * 1000;

export const ROUTES = {
  HOME: '/',
  RELEASE_DETAIL: '/releases/:id',
} as const;
