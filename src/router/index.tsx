import { createHashRouter, RouteObject } from 'react-router-dom';
import Root from '@/Root';
import Home from '@/pages/home';
import Test from '@/pages/test';
import Inscribe from '@/pages/inscribe';
import Ord2Index from '@/pages/explorer';
import Ord2Info from '@/pages/explorer/info';
import OrdxNs from '@/pages/explorer/ns';
import UtxoInfo from '@/pages/explorer/utxo';
import OrdxInscription from '@/pages/explorer/inscription';
import InscribeCheck from '@/pages/inscribe_check';
import Tools from '@/pages/tools';
import Account from '@/pages/account';
import SplittedInscription from '@/pages/tools/splittedInscription';
import Utxo from '@/pages/tools/utxo';
import { RareSat } from '@/pages/discover/rareSat';
import Transaction from '@/pages/tools/transaction';
import SearchSat from '@/pages/tools/searchSat';
import { OrdAddressInscriptionList } from '@/pages/account/components/OrdAddressInscriptions';
import OrdInscription from '@/pages/account/components/OrdInscription';
import { OrdSatInscriptionList } from '@/pages/account/components/OrdSatInscriptions';

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
  ORDX_NS: '/explorer/ns/:name',
  ORDX_UTXO_INFO: '/explorer/utxo/:utxo',
  ORDX_INSCRIPTION: '/explorer/inscription/:inscriptionId',
  ORDX_INSCRIPTIONS_BY_ADDRESS: '/explorer/inscriptions/:address',
  INSCRIBE_CHECK: '/inscribe_check',
  TOOLS: '/tools',
  TOOLS_SPLIT_SAT: '/tools/split-sat',
  TOOLS_UTXO: '/tools/utxo',
  TOOLS_TRANSACT: '/tools/transact',
  TOOLS_SEARCH_SAT: '/tools/search-sat',
  TOOLS_SPLITTED_INSCRIPTION: '/tools/splitted-inscription',
  DISCOVER_RARE_SAT: '/discover',
  ACCOUNT: '/account',
  ORD_INSCRIPTIONS_BY_ADDRESS: '/ord/inscriptions/address/:address',
  ORD_INSCRIPTIONS_BY_SAT: '/ord/inscriptions/sat/:sat',
  ORD_INSCRIPTION: '/ord/inscription/:inscriptionId',
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
        path: ROUTE_PATH.ORDX_NS,
        element: <OrdxNs />,
      },
      {
        path: ROUTE_PATH.ORDX_UTXO_INFO,
        element: <UtxoInfo />,
      },
      {
        path: ROUTE_PATH.ORDX_INSCRIPTION,
        element: <OrdxInscription />,
      },
      {
        path: ROUTE_PATH.ORD_INSCRIPTIONS_BY_ADDRESS,
        element: <OrdAddressInscriptionList />,
      },
      {
        path: ROUTE_PATH.ORD_INSCRIPTIONS_BY_SAT,
        element: <OrdSatInscriptionList />,
      },
      {
        path: ROUTE_PATH.ORD_INSCRIPTION,
        element: <OrdInscription />,
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
        path: ROUTE_PATH.TOOLS_UTXO,
        element: <Utxo />,
      },
      {
        path: ROUTE_PATH.TOOLS_TRANSACT,
        element: <Transaction/>,
      },
      {
        path: ROUTE_PATH.TOOLS_SEARCH_SAT,
        element: <SearchSat />,
      },
      {
        path: ROUTE_PATH.TOOLS_SPLITTED_INSCRIPTION,
        element: <SplittedInscription />,
      },
      {
        path: ROUTE_PATH.DISCOVER_RARE_SAT,
        element: <RareSat canSplit={false} />,
      },
      {
        path: ROUTE_PATH.ACCOUNT,
        element: <Account />,
      },
    ],
  },
];
export const router = createHashRouter(routes);
