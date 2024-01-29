import { Outlet, useSearchParams } from 'react-router-dom';
import { NavHeader } from '@/layout/NavHeader';
import { Alert, Layout, Menu, theme } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
const { Header, Content, Footer, Sider } = Layout;

export default function Root() {
  const { network } = useUnisatConnect();
  return (
    <Layout className='h-full'>
      <Header className=''>
        <NavHeader />
      </Header>
      <Content className='overflow-y-auto'>
        {network === 'testnet' && (
          <Alert
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
