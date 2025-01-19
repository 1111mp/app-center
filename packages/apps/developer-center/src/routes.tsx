import { createBrowserRouter, type RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('./pages/home'),
  },
  {
    path: '/detail/:id',
    lazy: () => import('./pages/detail'),
  },
];

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routes, {
    basename: process.env.DEBUG_MODE ? '/debug' : 'developer-center',
  });
