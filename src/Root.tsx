import { Outlet, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { NavHeader } from '@/layout/NavHeader';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

export default function Root() {
  return (
    <Layout className='h-full'>
      <Header className='sticky top-0 z-10'>
        <NavHeader />
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
