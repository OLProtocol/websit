import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'antd';
import { useState, useEffect } from 'react';
import { MenuProps } from 'antd';

import BitcoinBlueIcon from '@/assets/images/bitcoin-main.svg';
import BitcoinGreenIcon from '@/assets/images/bitcoin-testnet.svg';

export const ChainSelect = () => {
  const { i18n } = useTranslation();
  const { VITE_BTC_CHAIN, VITE_MAINNET_DOMAIN, VITE_TESTNET_DOMAIN } = import.meta.env;
  const needNetwork = VITE_BTC_CHAIN === 'mainnet' ? 'mainnet' : 'testnet';
  const [isMobile, setIsMobile] = useState(false);

  // 根据屏幕宽度判断是否为移动设备
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 小于 768px 视为移动设备
    };

    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup on unmount
    };
  }, []);


  const items: { key: string; label: string }[] = [
    { key: 'mainnet', label: 'Mainnet' },
    { key: 'testnet', label: 'Testnet' },
  ];

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

  const getIcon = () => {
    return needNetwork === 'mainnet' ? (
      <img src={BitcoinBlueIcon} alt="Mainnet" className='' style={{ width: 24, height: 24 }} />
    ) : (
      <img src={BitcoinGreenIcon} alt="Testnet" style={{ width: 24, height: 24 }} />
    );
  };

  return (
    <div className="flex items-center justify-center">
      <Dropdown
        menu={{
          items,
          onClick: handleMenuClick,
          defaultSelectedKeys: [needNetwork],
          selectable: true,
        }}
      >
        {/* <Button
          size="middle"
          className="flex items-center justify-center bg-transparent"
          
          shape="circle"
          icon={getIcon()}
        ></Button> */}

    <button
        className="flex justify-center text-zinc-200 gap-1 items-center h-10 px-3 border border-zinc-600 rounded-lg"
       
      >
       {getIcon()}{!isMobile ? (items.find(item => item.key === needNetwork)?.label ?? '') : ''}

      </button>
      </Dropdown>
    </div>
  );
};