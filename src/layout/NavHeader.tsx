import { Menu, Tag } from 'antd';
import { UnisatConnectButton } from '@/components/UnisatConnectButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { Select } from '@chakra-ui/react';

export const NavHeader = () => {
  const nav = useNavigate();
  const { t, i18n } = useTranslation();
  const routerLocation = useLocation();
  const { network } = useUnisatConnect();
  const { pathname } = routerLocation;
  const items: any[] = [
    {
      key: ROUTE_PATH.HOME,
      label: t('nav.home'),
      value: ROUTE_PATH.HOME,
      type: 'route',
    },
    {
      key: ROUTE_PATH.INSCRIBE,
      label: t('nav.inscribe'),
      value: ROUTE_PATH.INSCRIBE,
      type: 'route',
    },
    {
      key: ROUTE_PATH.ORDX_INDEX,
      label: t('nav.explorer'),
      value: ROUTE_PATH.ORDX_INDEX,
      type: 'route',
    },
    {
      key: 'https://docs.ordx.space/',
      label: t('nav.docs'),
      value: 'https://docs.ordx.space/',
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

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <header className='h-full'>
      <div className='flex h-full items-center'>
        <div className='flex-1 flex h-full items-center'>
          <div className='mr-4 text-white items-center flex'>
            <img src='/logo.jpg' alt='' className='h-8 mr-2' />
            <span className='hidden md:flex'>{t('app')}</span>
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
        <div className='flex justify-center h-full'>
          <UnisatConnectButton/>&nbsp;
          <Select placeholder={t('buttons.select_lang')} className='text-white mt-5' onChange={(e) => changeLanguage(e.target.value)}>
            <option value='zh'>中文</option>
            <option value='en'>English</option>
          </Select>
        </div>
      </div>
    </header>
  );
};
