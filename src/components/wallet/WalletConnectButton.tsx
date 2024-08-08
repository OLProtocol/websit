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
import { wallet } from '@unisat/wallet-sdk';

const { VITE_BTC_CHAIN, VITE_API_HOST, VITE_MAINNET_DOMAIN, VITE_TESTNET_DOMAIN } = import.meta.env;


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
    network,
    switchNetwork,
  } = useReactWalletStore((state) => state);

  const needNetwork = VITE_BTC_CHAIN === 'mainnet' ? 'mainnet' : 'testnet'

  const curNetwork = useMemo(() => {
    return network === 'testnet' ? 'testnet' : 'mainnet'
  }, [network])

  const toHistory = () => {
    const url = generateMempoolUrl({
      network: network,
      path: `address/${address}`,
    });
    window.open(url, '_blank');
  };

  useEffect(() => {
    console.log('walletConnectButton needNetwork', needNetwork, 'curNetwork', curNetwork, 'network', network);
    if (needNetwork === curNetwork) {
      if (address) {
        console.log('walletConnectButton check');
        check();
      }
    } else {
      console.log('walletConnectButton disconnect');
      btcWallet?.disconnect();
    }
    // check();
  }, [address, btcWallet, check, curNetwork, needNetwork, network]);

  useEffect(() => {
    // console.log('walletConnectButton needNetwork', needNetwork, 'curNetwork', curNetwork, 'network', network);
    // if (needNetwork !== curNetwork) {
    //   console.log('walletConnectButton disconnect');
    //   btcWallet?.disconnect();
    // }
  }, [btcWallet, curNetwork, needNetwork, network]);



  const handleWalletSwitchNetwork = async () => {
    switch (needNetwork) {
      case 'testnet':
        location.href = VITE_MAINNET_DOMAIN;
        break;
      case 'mainnet':
        location.href = VITE_TESTNET_DOMAIN;
        break;
    }
  }
  const onConnectWalletSuccess = async () => {
    // notification.success({
    //   message: 'Connect Wallet Success',
    //   description: t('wallet.connect_success'),
    // })
  };
  const onConnectError = (error: any) => {
    notification.error({
      message: 'Connect Wallet Failed',
      description: error.message,
    });
  };
  const handleWalletDisconnect = async () => {
    notification.success({
      message: 'Disconnect Wallet Success',
      description: t('wallet.disconnect_success'),
    });
  };
  const onAccountChanged = async (acountList: string[]) => {
    console.log('walletConnectButton onAccountChanged, accountList', acountList);
    const changedAddress = acountList[0];
    if (changedAddress !== address) {
      disconnect();
      return;
    }
    const [err] = await tryit(check)();
    if (err) {
      console.error(err);
    }
  };
  const onNetworkChanged = async (switchedNetwork: string) => {
    console.log('walletConnectButton onNetworkChanged, switchedNetwork', switchedNetwork);
    if (needNetwork !== switchedNetwork) {
      disconnect();
    }
  };
  useEffect(() => {
    if (connected) {
      btcWallet?.on('accountsChanged', onAccountChanged);
      btcWallet?.on('networkChanged', onNetworkChanged);
    } else {
      btcWallet?.removeListener('accountsChanged', onAccountChanged);
      btcWallet?.removeListener('networkChanged', onNetworkChanged);
    }
    return () => {
      btcWallet?.removeListener('accountsChanged', onAccountChanged);
      btcWallet?.removeListener('networkChanged', onNetworkChanged);
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
      onConnectSuccess={onConnectWalletSuccess}
      onConnectError={onConnectError}
      onDisconnectSuccess={handleWalletDisconnect}
    >
      <>
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
                <Button type='primary' className='w-32' onClick={handleWalletSwitchNetwork}>
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
        </Popover>
      </>
    </WalletConnectReact>
  );
};
