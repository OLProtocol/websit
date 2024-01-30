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
  useEffect(() => {
    if (heightData) {
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
