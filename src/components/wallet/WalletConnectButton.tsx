import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { Button, Popover, Space, Divider, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  WalletConnectReact,
  useReactWalletStore,
} from '@sat20/btc-connect/dist/react';
import { generateMempoolUrl } from '@/lib/utils';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import '@sat20/btc-connect/dist/style/index.css';
import { hideStr } from '@/lib/utils';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { tryit } from 'radash';
import { useCommonStore } from '@/store';
import { wallet } from '@unisat/wallet-sdk';

const { VITE_BTC_CHAIN, VITE_API_HOST } = import.meta.env;

export const WalletConnectButton = () => {
  const { t } = useTranslation();
  const routerLocation = useLocation();
  const router = useNavigate();
  const {
    connected,
    check,
    address,
    disconnect,
    balance,
    btcWallet,
    network: curNetwork,
    switchNetwork,
  } = useReactWalletStore((state) => state);
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
    const url = generateMempoolUrl({
      network: curNetwork,
      path: `address/${address}`,
    });
    window.open(url, '_blank');
  };
  useEffect(() => {
    console.log('check', connected);

    check();
    updateStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const needNetwork = useMemo(() => {
    return VITE_BTC_CHAIN === 'mainnet' ? 'livenet' : 'testnet';
  }, [])

  const updateStatus = async () => {
    if (connected && needNetwork !== curNetwork) {
      disconnect();
    }
  };

  const onConnectSuccess = async () => {
    // btcWallet?.switchNetwork(curNetwork).then(() => {
    //   console.log('switchNetwork success');
    // }).catch((err) => {
    //   disconnect();
    //   console.error('switchNetwork error', err);
    // }).finally(() => {
    //   console.log('finally');
    // })
    // if (connected && needNetwork !== curNetwork) {
    //   disconnect();
    // }
  };
  const onConnectError = (error: any) => {
    console.error('Connect Wallet Failed', error);
    notification.error({
      message: 'Connect Wallet Failed',
      description: error.message,
    });
  };
  const handlerDisconnect = async () => {
    console.log('disconnect success');
    // disconnect();
  };
  const accountAndNetworkChange = async () => {
    const [err] = await tryit(check)();
    console.error(err);
  };
  useEffect(() => {
    console.log('connected', connected);
    if (connected) {
      btcWallet?.on('accountsChanged', accountAndNetworkChange);
      btcWallet?.on('networkChanged', accountAndNetworkChange);
    } else {
      btcWallet?.removeListener('accountsChanged', accountAndNetworkChange);
      btcWallet?.removeListener('networkChanged', accountAndNetworkChange);
    }
    return () => {
      btcWallet?.removeListener('accountsChanged', accountAndNetworkChange);
      btcWallet?.removeListener('networkChanged', accountAndNetworkChange);
    };
  }, [connected]);
  const hideAccount = useMemo(() => {
    return hideStr(address, 3, '**');
  }, [address]);
  return (
    <WalletConnectReact
      config={{
        network: needNetwork,
        defaultConnectorId: 'unisat',
      }}
      theme='light'
      isSwitchNetwork={true}
      onConnectSuccess={onConnectSuccess}
      onConnectError={onConnectError}
      onDisconnectSuccess={handlerDisconnect}
      children={<Popover
        content={
          <div>
            <div className='flex justify-center items-center'>
              <span className='mr-2'>{balance.total} SAT</span>
              <Tag color='error'>{curNetwork}</Tag>
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
              <Button type='primary' className='w-32' onClick={switchNetwork}>
                {t('buttons.switchNetwork')}
              </Button>
            </div>
            <Divider style={{ margin: '10px 0' }} />
            <div className='flex justify-center'>
              <Button type='primary' className='w-32' onClick={toHistory}>
                {t('buttons.toHistory')}
              </Button>
            </div>
            <Divider style={{ margin: '10px 0' }} />
            <div className='flex justify-center'>
              <Button type='primary' className='w-32' onClick={disconnect}>
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
      </Popover>}
    >
    </WalletConnectReact>
  );
};
