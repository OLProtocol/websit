/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useSearchParams } from 'react-router-dom';
import { NavHeader } from '@/layout/NavHeader';
import { Alert, Layout, Menu, theme } from 'antd';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
const { Header, Content, Footer, Sider } = Layout;
import { useCommonStore } from './store';
import { UpdateVersionModal } from './components/UpdateVersionModal';
import { useIndexHeight } from '@/swr';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Root() {
  const { network } = useReactWalletStore((state) => state);
  const { resp } = useIndexHeight();

  const { setHeight, setServiceStatus, setAppVersion } = useCommonStore(
    (state) => state,
  );
  const { VITE_TIP_STATUS, VITE_TIP_HEIGHT } = import.meta.env;
  const { t } = useTranslation();
  const { VITE_BTC_CHAIN, VITE_API_HOST, VITE_MAINNET_DOMAIN, VITE_TESTNET_DOMAIN } = import.meta.env;

  useEffect(() => {
    const height = resp?.data?.height || 0;
    if (height) {
      const serviceStatus = height >= Number(VITE_TIP_HEIGHT);
      setServiceStatus(serviceStatus ? 1 : 0);
      setHeight(height);
    }
  }, [resp]);
  return (
    <Layout className='h-full'>
      <UpdateVersionModal />
      <Header className=''>
        <NavHeader />
      </Header>
      <Content className='overflow-y-auto'>
        {network === 'testnet' && (
          <Alert
            closable
            message={t('common.btcNetwork_alert') + ' ' + VITE_BTC_CHAIN}
            className='text-center'
            type='warning'
          />
        )}
        <Outlet />
      </Content>
    </Layout>
  );
}
