import React, { useMemo } from 'react';
import type { MenuProps } from 'antd';
import { Button, Popover, Space, Divider, Tag } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import { Center, useToast } from '@chakra-ui/react';

import { hideStr } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const UnisatConnectButton = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const {
    currentAccount,
    isConnected,
    balance,
    network,
    isUnisatInstalled,
    connectWallet,
    switchNetwork,
    disconnectWallet,
  } = useUnisatConnect();
  const disconnect = async () => {
    await disconnectWallet();
  };
  const connect = async () => {
    if (!isUnisatInstalled) {
      console.log('UniSat Wallet is installed!');
      toast({
        title: 'UniSat Wallet is installed!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await connectWallet();
    // await switchNetwork('testnet');
  };
  const items: MenuProps['items'] = [
    {
      label: '1st menu item',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: '2nd menu item',
      key: '2',
      icon: <UserOutlined />,
    },
    {
      label: '3rd menu item',
      key: '3',
      icon: <UserOutlined />,
      danger: true,
    },
    {
      label: '4rd menu item',
      key: '4',
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const switchNetworkHandler = async () => {
    await switchNetwork(network === 'testnet' ? 'livenet' : 'testnet');
  };
  const hideAccount = useMemo(() => {
    return hideStr(currentAccount, 4);
  }, [currentAccount]);
  return (
    <>
      {isConnected ? (
        <Popover
          content={
            <div>
              <div className='flex justify-center items-center'>
                <span className='mr-2'>{balance.total} SAT</span>
                <Tag color='error'>{network}</Tag>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div className='flex justify-center'>
                <Button
                  type='primary'
                  className='w-28'
                  onClick={switchNetworkHandler}>
                  {t('buttons.switchNetwork')}
                </Button>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div className='flex justify-center'>
                <Button type='primary' className='w-28' onClick={disconnect}>
                  {t('buttons.disconnect')}
                </Button>
              </div>
            </div>
          }>
          <Button shape='round' size='large'>
            <Space>
              {hideAccount}
              <DownOutlined />
            </Space>
          </Button>
        </Popover>
      ) : (
        <Button size='large' type='primary' onClick={connect}>
          {t('buttons.connect')}
        </Button>
      )}
    </>
  );
};
