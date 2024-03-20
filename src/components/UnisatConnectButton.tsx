import React, { useMemo } from 'react';
import type { MenuProps } from 'antd';
import { Button, Popover, Space, Divider, Tag } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import { useNavigate } from 'react-router-dom';
import { Center, useToast } from '@chakra-ui/react';

import { hideStr } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATH } from '@/router';

export const UnisatConnectButton = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const nav = useNavigate();
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
  const toHistory = () => {
    const url = `https://mempool.space${
      network === 'testnet' ? '/testnet' : ''
    }/address/${currentAccount}`;
    window.open(url, '_blank');
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const switchNetworkHandler = async () => {
    // await switchNetwork('testnet');
    await switchNetwork(network === 'testnet' ? 'livenet' : 'testnet');
  };
  const hideAccount = useMemo(() => {
    return hideStr(currentAccount, 3, '**');
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
              {/* <Divider style={{ margin: '10px 0' }} />
              <div className='flex justify-center'>
                <Button
                  type='primary'
                  className='w-28'
                  onClick={toAccount}>
                  {t('buttons.toAccount')}
                </Button>
              </div>  */}
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
                <Button type='primary' className='w-28' onClick={toHistory}>
                  交易历史
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
          <Button shape='round' size='small'>
            <Space>
              {hideAccount}
              <DownOutlined />
            </Space>
          </Button>
        </Popover>
      ) : (
        <Button size='small' type='primary' onClick={connect}>
          {t('buttons.connect')}
        </Button>
      )}
    </>
  );
};
