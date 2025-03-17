import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'antd';
import { BoldOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';


export const ChainSelect = () => {
  const { i18n } = useTranslation();
  const items: MenuProps['items'] = [
    { key: 'mainnet', label: 'mainnet' },
    { key: 'testnet', label: 'testnet' },
  ];

  const { VITE_BTC_CHAIN, VITE_MAINNET_DOMAIN, VITE_TESTNET_DOMAIN } = import.meta.env;
  const needNetwork = VITE_BTC_CHAIN === 'mainnet' ? 'mainnet' : 'testnet'

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'mainnet':
        location.href = VITE_MAINNET_DOMAIN;
        break;
      case 'testnet':
        location.href = VITE_TESTNET_DOMAIN;
        break;
    }
  };

  return (
    <div>
      <Dropdown
        menu={{
          items,
          onClick: handleMenuClick,
          defaultSelectedKeys: [needNetwork],
          selectable: true,
        }}>
        <Button
          size='middle'
          className='flex items-center justify-center'
          type='primary'
          shape='circle'
          icon={<BoldOutlined />}></Button>
      </Dropdown>
    </div>

  );
};
