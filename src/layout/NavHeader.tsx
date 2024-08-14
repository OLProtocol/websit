import { Menu, Tag } from 'antd';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { FeerateSelectButton } from '@/components/FeerateSelectButton';
import { LanguageSelect } from '@/components/LanguageSelect';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

export const NavHeader = () => {
  const nav = useNavigate();
  const { t, i18n } = useTranslation();
  const routerLocation = useLocation();
  const { pathname } = routerLocation;
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
      key: ROUTE_PATH.SAT20_INDEX,
      label: t('nav.explorer'),
      value: ROUTE_PATH.SAT20_INDEX,
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
          ? 'https://docs.sat20.org/en/'
          : 'https://docs.sat20.org/',
      type: 'link',
    },

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

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
  }

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

        <div className='flex justify-center h-full items-center gap-2'>
          <FeerateSelectButton />
          <WalletConnectButton />
          <LanguageSelect />
        </div>
      </div>
    </header>
  );
};
