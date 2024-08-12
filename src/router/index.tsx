import { createHashRouter, RouteObject } from 'react-router-dom';
import Root from '@/Root';
import Home from '@/pages/home';
import Test from '@/pages/test';
import Inscribe from '@/pages/inscribe';
import Sat20Index from '@/pages/explorer';
import TokenInfo from '@/pages/explorer/TokenInfo';
import Sat20NameInfo from '@/pages/explorer/Sat20NameInfo';
import UtxoInfo from '@/pages/explorer/utxo';
import Sat20Inscription from '@/pages/explorer/inscription';
import Account from '@/pages/account';
import SplittedInscription from '@/pages/tools/splittedInscription';
import Utxo from '@/pages/tools/utxo';
import InscribeCheck from '@/pages/inscribe_check';
import Tools from '@/pages/tools';
import { RareSat } from '@/pages/discover/rareSat';
import Transaction from '@/pages/tools/transaction';
import SearchSat from '@/pages/tools/searchSat';
import { OrdAddressInscriptionList } from '@/pages/account/components/OrdAddressInscriptions';
import OrdInscription from '@/pages/account/components/OrdInscription';
import { OrdSatInscriptionList } from '@/pages/account/components/OrdSatInscriptions';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';

interface RareSatContainerProps {
  canSplit: boolean;
}

export const RareSatContainer: React.FC<RareSatContainerProps> = ({ canSplit }) => {
  const { address: currentAccount } = useReactWalletStore();
  return <RareSat canSplit={canSplit} targetAddress={""} />;
};

const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  HOME: '/',
  TEST: '/test',
  INSCRIBE: '/inscribe',
  INSCRIBE_TEST: '/inscribe_test',
  SAT20_INDEX: '/explorer',
  SAT20_INFO: '/explorer/:tick',
  SAT20_NS: '/explorer/ns/:name',
  SAT20_UTXO_INFO: '/explorer/utxo/:utxo',
  SAT20_INSCRIPTION: '/explorer/inscription/:inscriptionId',
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
        element: <Sat20Index />,
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
        path: ROUTE_PATH.SAT20_INDEX,
        element: <Sat20Index />,
      },
      {
        path: ROUTE_PATH.SAT20_INFO,
        element: <TokenInfo />,
      },
      {
        path: ROUTE_PATH.SAT20_NS,
        element: <Sat20NameInfo />,
      },
      {
        path: ROUTE_PATH.SAT20_UTXO_INFO,
        element: <UtxoInfo />,
      },
      {
        path: ROUTE_PATH.SAT20_INSCRIPTION,
        element: <Sat20Inscription />,
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
        element: <Transaction />,
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
        element: <RareSatContainer canSplit={false} />,
      },
      {
        path: ROUTE_PATH.ACCOUNT,
        element: <Account />,
      },
    ],
  },
];
export const router = createHashRouter(routes);
