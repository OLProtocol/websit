import { Outlet, useSearchParams } from 'react-router-dom';
import { NavHeader } from '@/layout/NavHeader';
import { Alert, Layout, Menu, theme } from 'antd';
import { useReactWalletStore } from 'btc-connect/dist/react';
const { Header, Content, Footer, Sider } = Layout;
import { useCommonStore } from './store';
import { UpdateVersionModal } from './components/UpdateVersionModal';
import { useBtcHeight, getBlockStatus } from '@/api';
import { useEffect } from 'react';

export default function Root() {
  const { network } = useReactWalletStore((state) => state);
  const { data: heightData } = useBtcHeight(network as any);

  const { setHeight, setServiceStatus, setAppVersion } = useCommonStore(
    (state) => state,
  );
  const { VITE_TIP_STATUS, VITE_TIP_HEIGHT } = import.meta.env;
  useEffect(() => {
    const height = heightData;
    if (height) {
      const serviceStatus = heightData >= Number(VITE_TIP_HEIGHT);
      setServiceStatus(serviceStatus ? 1 : 0);
      setHeight(height);
      getBlockStatus({ height: height, network }).then((res) => {
        console.log(res);
      });
    }
  }, [heightData]);
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
            message='现在是测试网'
            className='text-center'
            type='warning'
          />
        )}
        <Outlet />
      </Content>
    </Layout>
  );
}
