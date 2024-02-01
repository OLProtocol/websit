import { Outlet, useSearchParams } from 'react-router-dom';
import { NavHeader } from '@/layout/NavHeader';
import { Alert, Layout, Menu, theme } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
const { Header, Content, Footer, Sider } = Layout;
import { useGlobalStore } from './store';
import { useBtcHeight } from '@/api';
import { useEffect } from 'react';

export default function Root() {
  const { network } = useUnisatConnect();
  const { data: heightData } = useBtcHeight(network as any);
  const { setHeight } = useGlobalStore((state) => state);
  const { VITE_TIP_STATUS, VITE_TIP_HEIGHT } = import.meta.env;
  useEffect(() => {
    if (heightData) {
      const serviceStatus =
        VITE_TIP_STATUS === '1' || heightData >= Number(VITE_TIP_HEIGHT);
      setHeight(heightData);
    }
  }, [heightData]);
  return (
    <Layout className='h-full'>
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
