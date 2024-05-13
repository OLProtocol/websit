import { Menu, Tag } from 'antd';
import { UnisatConnectButton } from '@/components/UnisatConnectButton';
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
      // value: ROUTE_PATH.HOME,
      value:
        i18n.language == 'en'
          ? 'https://ordx.space'
          : 'https://ordx.space/index-zh.html',
      type: 'link',
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

    // {
    //   key: ROUTE_PATH.MARKET_INDEX,
    //   label: t('nav.market'),
    //   value: ROUTE_PATH.MARKET_INDEX,
    //   type: 'route',
    // },
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
      key: 'https://docs.ordx.space/',
      label: t('nav.docs'),
      value:
        i18n.language == 'en'
          ? 'https://docs.ordx.space/v/en/'
          : 'https://docs.ordx.space/',
      type: 'link',
    },
    // {
    //   key: ROUTE_PATH.TOOLS,
    //   label: t('nav.tools'),
    //   value: ROUTE_PATH.TOOLS,
    //   type: 'route',
    // },
  ];
  // if (['ordx.space'].every((v) => location.hostname !== v)) {
  //   items.push({
  //     key: ROUTE_PATH.TOOLS,
  //     label: t('nav.tools'),
  //     value: ROUTE_PATH.TOOLS,
  //     type: 'route',
  //   });
  // }
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

        <div className='flex justify-center h-full items-center gap-2'>
          <FeerateSelectButton />
          {/* <UnisatConnectButton /> */}
          <WalletConnectButton />
          <LanguageSelect />
        </div>
      </div>
    </header>
  );
};
