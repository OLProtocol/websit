import { Menu, Tag } from 'antd';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { FeerateSelectButton } from '@/components/FeerateSelectButton';
import { LanguageSelect } from '@/components/LanguageSelect';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { ChainSelect } from '@/components/ChainSelect';

import { useState, useEffect } from 'react';
import './navheader.css';


export const NavHeader = () => {
  const [isMobile, setIsMobile] = useState(false);
  const nav = useNavigate();
  const { t, i18n } = useTranslation();
  const routerLocation = useLocation();
  const { pathname } = routerLocation;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
  }, []);

  const { VITE_BTC_CHAIN, VITE_MAINNET_DOMAIN, VITE_TESTNET_DOMAIN,
    VITE_SATSNET_DOMAIN, VITE_SATSTESTNET_DOMAIN,
  } = import.meta.env;
  const needNetwork = VITE_BTC_CHAIN === 'mainnet' ? 'mainnet' : 'testnet'
  const items: any[] = [
    {
      key: ROUTE_PATH.HOME,
      label: t('nav.home'),
      value:
        i18n.language == 'en'
          ? 'https://sat20.org'
          : 'https://sat20.org/index-zh.html',
      type: 'link',
    },
    {
      key: ROUTE_PATH.INDEX,
      label: t('nav.explorer'),
      value: ROUTE_PATH.INDEX,
      type: 'route',
    },
    {
      key: ROUTE_PATH.DISCOVER_RARE_SAT,
      label: t('nav.discover'),
      value: ROUTE_PATH.DISCOVER_RARE_SAT,
      type: 'route',
    },
    {
      key: ROUTE_PATH.ACCOUNT,
      label: t('nav.assets'),
      value: ROUTE_PATH.ACCOUNT,
      type: 'route',
    },
    {
      key: 'https://ordx.market/',
      label: t('nav.market'),
      value: 'https://ordx.market/',
      type: 'link',
    },
    {
      key: 'https://docs.sat20.org/',
      label: t('nav.docs'),
      value:
        i18n.language == 'en'
          ? 'https://docs.sat20.org/v/english/'
          : 'https://docs.sat20.org/',
      type: 'link',
    },
    {
      key: "satsnet_browser",
      label: t('nav.satsnet_browser'),
      value:
        needNetwork == 'mainnet'
          ? VITE_SATSNET_DOMAIN
          : VITE_SATSTESTNET_DOMAIN,
      type: 'link',
    },
    // {
    //   key: "chain",
    //   label: t('nav.chain'),
    //   value:
    //     needNetwork == 'mainnet'
    //       ? VITE_MAINNET_DOMAIN
    //       : VITE_TESTNET_DOMAIN,
    //   type: 'link',
    // },
  ];

  const options = [
    { value: 'en', label: 'EN' },
    { value: 'ZH', label: 'zh' },
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
            <img src='/logo.png' alt='' className='h-8 mr-2' />
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
        </div>

        <div className="flex justify-center h-full items-center gap-2" style={{ flexWrap: 'wrap' }}>
          <div className={isMobile ? 'hidden' : ''}>
            <FeerateSelectButton />
          </div>
          <WalletConnectButton />
          <LanguageSelect />
          <ChainSelect />
        </div>
      </div>
    </header>
  );
};
