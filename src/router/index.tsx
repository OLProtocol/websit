import { createHashRouter, RouteObject } from 'react-router-dom';
import Root from '@/Root';
import Home from '@/pages/home';
import Inscribe from '@/pages/inscribe';
import Ord2Index from '@/pages/ordx';
import Ord2Info from '@/pages/ordx/info';

const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  HOME: '/',
  INSCRIBE: '/inscribe',
  ORDX_INDEX: '/ordx',
  ORDX_INFO: '/ordx/:tick'
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
        path: ROUTE_PATH.ORDX_INDEX,
        element: <Ord2Index />,
      },
      {
        path: ROUTE_PATH.ORDX_INFO,
        element: <Ord2Info />,
      },
    ],
  },
];
export const router = createHashRouter(routes);
