import type { MenuProps } from 'antd';
import {useMemo} from 'react';
import { Button, Popover, Space, Divider, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  WalletConnectReact,
  useReactWalletStore,
} from 'btc-connect/dist/react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import 'btc-connect/dist/style/index.css';
import { hideStr } from '@/lib/utils';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';

export const WalletConnectButton = () => {
  const { t } = useTranslation();
  const router = useNavigate();
  const { connected, check, address, disconnect, balance, btcWallet, network, switchNetwork } =
    useReactWalletStore((state) => state);
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
    }/address/${address}`;
    window.open(url, '_blank');
  };
  useEffect(() => {
    console.log('check', connected);
    check();
  }, []);
  const onConnectSuccess = async (wallet: any) => {

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
    await disconnect();
  };
  const accountAndNetworkChange = async () => {
    // console.log('accountAndNetworkChange');
    // console.log('connected', connected);
    // try {
    //   if (process.env.NEXT_PUBLIC_SIGNATURE_TEXT && connected) {
    //     try {
    //       const _s = await btcWallet?.signMessage(
    //         process.env.NEXT_PUBLIC_SIGNATURE_TEXT,
    //       );
    //       if (_s) {
    //         setSignature(_s);
    //       }
    //     } catch (error) {
    //       await disconnect();
    //     }
    //   }
    //   await check();
    // } catch (error) {
    //   console.log(error);
    // }
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
        network: 'testnet',
        defaultConnectorId: 'okx',
      }}
      theme='light'
      onConnectSuccess={onConnectSuccess}
      onConnectError={onConnectError}
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
                <Button
                  type='primary'
                  className='w-32'
                  onClick={switchNetwork}>
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
