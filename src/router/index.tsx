import { createHashRouter, RouteObject } from 'react-router-dom';
import Root from '@/Root';
import Home from '@/pages/home';
import Test from '@/pages/test';
import Inscribe from '@/pages/inscribe';
import Ord2Index from '@/pages/explorer';
import Ord2Info from '@/pages/explorer/info';
import OrdxInscription from '@/pages/explorer/inscription';
import InscribeCheck from '@/pages/inscribe_check';
import Tools from '@/pages/tools';
import RareSat from '@/pages/discover/rareSat';
import Account from '@/pages/account';
import SplitSats from '@/pages/tools/splitSats';
import SplittedInscription from '@/pages/tools/splittedInscription';
import UtxoAsset from '@/pages/tools/utxoAsset';

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
  ORDX_INSCRIPTION: '/explorer/inscription/:inscriptionnum',
  INSCRIBE_CHECK: '/inscribe_check',
  TOOLS: '/tools',
  TOOLS_SPLIT_SATS: '/tools/split-sats',
  TOOLS_UTXO_ASSET: '/tools/utxo-asset',
  TOOLS_SPLITTED_INSCRIPTION: '/tools/splitted-inscription',
  // MARKET_INDEX: '/market',
  DISCOVER_RARE_SAT: '/discover',
  ACCOUNT: '/account',
  RARE_SAT: '/tools/rare_sat',
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
        path: ROUTE_PATH.ORDX_INSCRIPTION,
        element: <OrdxInscription />,
      },
      {
        path: ROUTE_PATH.INSCRIBE_CHECK,
        element: <InscribeCheck />,
      },
      {
        path: ROUTE_PATH.TOOLS,
        element: <Tools />,
      },{
        path: ROUTE_PATH.RARE_SAT,
        element: <RareSat />,
      },
      {
        path: ROUTE_PATH.TOOLS_SPLIT_SATS,
        element: <SplitSats />,
      },
      {
        path: ROUTE_PATH.TOOLS_UTXO_ASSET,
        element: <UtxoAsset />,
      },
      {
        path: ROUTE_PATH.TOOLS_SPLITTED_INSCRIPTION,
        element: <SplittedInscription />,
      },
      // {
      //   path: ROUTE_PATH.MARKET_INDEX,
      //   element: <MarketIndex />,
      // },
      {
        path: ROUTE_PATH.DISCOVER_RARE_SAT,
        element: <RareSat />,
      },
      {
        path: ROUTE_PATH.ACCOUNT,
        element: <Account />,
      },
    ],
  },
];
export const router = createHashRouter(routes);
