import { createHashRouter, RouteObject } from 'react-router-dom';
import Root from '@/Root';
import Home from '@/pages/home';
import Test from '@/pages/test';
import Inscribe from '@/pages/inscribe';
import Ord2Index from '@/pages/explorer';
import Ord2Info from '@/pages/explorer/info';
import InscribeCheck from '@/pages/inscribe_check';
import Tools from '@/pages/tools';
import MARKET_INDEX from '@/pages/market';

const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  HOME: '/',
  TEST: '/test',
  INSCRIBE: '/inscribe',
  INSCRIBE_TEST: '/inscribe_test',
  ORDX_INDEX: '/explorer',
  ORDX_INFO: '/explorer/:tick',
  INSCRIBE_CHECK: '/inscribe_check',
  TOOLS: '/tools',
  MARKET_INDEX: '/market',
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
        path: ROUTE_PATH.TEST,
        element: <Test />,
      },
      {
        path: ROUTE_PATH.INSCRIBE,
        element: <Inscribe />,
      },
      {
        path: ROUTE_PATH.INSCRIBE_TEST,
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
      {
        path: ROUTE_PATH.INSCRIBE_CHECK,
        element: <InscribeCheck />,
      },
      {
        path: ROUTE_PATH.TOOLS,
        element: <Tools />,
      },
      {
        path: ROUTE_PATH.MARKET_INDEX,
        element: <Tools />,
      },
    ],
  },
];
export const router = createHashRouter(routes);
