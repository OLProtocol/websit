import { createHashRouter, RouteObject } from 'react-router-dom';
import Root from '@/Root';
import Home from '@/pages/home';
import Inscribe from '@/pages/inscribe';
import Brc20Index from '@/pages/brc20';

const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  HOME: '/',
  INSCRIBE: '/inscribe',
  BRC20_INDEX: '/brc20',
};
const hashPath: any = {};
Object.keys(ROUTE_PATH).forEach((k: any) => {
  hashPath[k] = resolveHashPath((ROUTE_PATH as any)[k]);
});

export const ROUTE_HASH_PATH: typeof ROUTE_PATH = hashPath;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE_PATH.HOME,
        element: <Home />,
      },
      {
        path: ROUTE_PATH.INSCRIBE,
        element: <Inscribe />,
      },
      {
        path: ROUTE_PATH.BRC20_INDEX,
        element: <Brc20Index />,
      },
    ],
  },
];
export const router = createHashRouter(routes);
