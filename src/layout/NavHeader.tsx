import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { UnisatConnectButton } from '@/components/UnisatConnectButton';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { LinkBox, LinkOverlay } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ROUTE_PATH } from '@/router';

export const NavHeader = () => {
  const nav = useNavigate();
  const routerLocation = useLocation();
  const { pathname } = routerLocation;
  const items: any[] = [
    {
      key: ROUTE_PATH.HOME,
      label: `Home`,
      value: ROUTE_PATH.HOME,
      type: 'route',
    },
    {
      key: ROUTE_PATH.INSCRIBE,
      label: `Inscribe`,
      value: ROUTE_PATH.INSCRIBE,
      type: 'route',
    },
    {
      key: ROUTE_PATH.ORDX_INDEX,
      label: `Explorer`,
      value: ROUTE_PATH.ORDX_INDEX,
      type: 'route',
    },
    {
      key: 'https://docs.tinyverse.space/',
      label: `Docs`,
      value: 'https://docs.tinyverse.space/',
      type: 'link',
    },
  ];
  const onMenuSelect = (item: any) => {
    const { key } = item;
    const { value, type } = items.find((i) => i.key === key) || {};
    if (value) {
      if (type === 'link') {
        window.open(value, '_blank');
      } else if (type === 'route') {
        nav(value);
      }
    }
  };
  return (
    <header className='h-full'>
      <div className='flex h-full items-center'>
        <div className='flex-1 flex h-full items-center'>
          <div className='mr-4 text-white items-center flex'>
            <img src='/logo.jpg' alt='' className='h-8 mr-2' />
            <span>OLD Protocol</span>
          </div>
          <Menu
            onSelect={onMenuSelect}
            theme='dark'
            selectedKeys={[pathname]}
            mode='horizontal'
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
          {/* <LinkBox>
            <LinkOverlay href='/#/'>
              Home
            </LinkOverlay>
          </LinkBox> */}
          {/* <Divider orientation='vertical' className='mx-4' /> */}
          {/* <LinkBox>
            <LinkOverlay href='/#/inscribe'>
              Inscribe
            </LinkOverlay>
          </LinkBox>
          <Divider orientation='vertical' className='mx-4' />
          <LinkBox>
            <LinkOverlay href='/#/ordx'>
              Ordx
            </LinkOverlay>
          </LinkBox> */}
        </div>
        <div className='flex justify-center'>
          <UnisatConnectButton />
        </div>
      </div>
    </header>
  );
};
