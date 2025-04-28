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

  const [initNetwork, setInitNetwork] = useState(true);

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
    if (needNetwork === curNetwork) {
      initNetwork && check();
      setInitNetwork(false);
    } else {
      connected && disconnect();
    }
  }, [initNetwork, connected, address, disconnect, check, curNetwork, needNetwork]);

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

  const disconnectWallet = async () => {
    disconnect();
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
  const onWalletDisconnectSuccess = async () => {
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

//   return (
//     <WalletConnectReact
//       config={{
//         network: needNetwork,
//       }}
//       theme='light'
//       isSwitchNetwork={true}
//       onConnectSuccess={onConnectWalletSuccess}
//       onConnectError={onConnectError}
//       onDisconnectSuccess={onWalletDisconnectSuccess}
//     >
//       <>
//         <Popover
//           content={
//             <div>
//               <div className='flex h-10 justify-center items-center'>
//                 <span className='mr-2'>{balance.total} SAT</span>
//                 <Tag color='error'>{network}</Tag>
//               </div>
//               {/* <Divider style={{ margin: '10px 0' }} />
//             <div className='flex justify-center'>
//               <Button
//                 type='primary'
//                 className='w-28'
//                 onClick={toAccount}>
//                 {t('buttons.toAccount')}
//               </Button>
//             </div>  */}
//               {/* <Divider style={{ margin: '10px 0' }} />
//               <div className='flex justify-center'>
//                 <Button type='primary' className='w-32' onClick={handleWalletSwitchNetwork}>
//                   {t('buttons.switchNetwork')}
//                 </Button>
//               </div> */}
//               <Divider style={{ margin: '10px 0' }} />
//               <div className='flex justify-center'>
//                 <Button type='primary' className='w-32' onClick={toHistory}>
//                   {t('buttons.toHistory')}
//                 </Button>
//               </div>
//               <Divider style={{ margin: '10px 0' }} />
//               <div className='flex justify-center'>
//                 <Button type='primary' className='w-32' onClick={disconnectWallet}>
//                   {t('buttons.disconnect')}
//                 </Button>
//               </div>
//             </div>
//           }>
//           <Button shape='round' size='small'>
//             <Space>
//               {hideAccount}
//               <DownOutlined />
//             </Space>
//           </Button>
//         </Popover>
//       </>
//     </WalletConnectReact>
//   );
// };
return (
  <WalletConnectReact
    config={{
      network: needNetwork,
    }}
    theme="light"
    isSwitchNetwork={true}
    onConnectSuccess={onConnectWalletSuccess}
    onConnectError={onConnectError}
    onDisconnectSuccess={onWalletDisconnectSuccess}
  >
    <>
      <Popover
        content={
          <div style={{ width: '200px', textAlign: 'center' }}>
            <div className="flex flex-col items-center mb-4">
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {balance.total} SAT
              </span>
              <Tag color={network === 'mainnet' ? 'green' : 'red'} style={{ marginTop: '8px' }}>
                {network.toUpperCase()}
              </Tag>
            </div>
            <Divider style={{ margin: '10px 0' }} />
            <div className="flex flex-col gap-2">
              <button               
                className="w-full h-10 px-3 py-2"
                onClick={toHistory}
                style={{
                  border: '2px solid #3f3f46', // 深灰色边框 (zinc-700)
                  borderRadius: '8px', // 圆角
                  padding: '8px 16px', // 内边距
                }}
              >
                {t('buttons.toHistory')}
              </button>
              <button                
                className="w-full first-letter: border border-zinc-700 rounded-lg px-3 py-2"
                onClick={disconnectWallet}
                style={{ borderRadius: '8px', color: 'red', borderColor: 'red' }}
              >
                {t('buttons.disconnect')}
              </button>
            </div>
          </div>
        }
        trigger="click"
        placement="bottomRight"
      >
        <button
          // shape="round"
          // size="small"
          className="flex justify-center items-center h-10 border border-zinc-800 rounded-lg px-3"
          // style={{
          //   backgroundColor: '#1890ff',
          //   color: 'white',
          //   border: 'none',
          //   padding: '0 16px',
          //   height: '40px',
          //   display: 'flex',
          //   alignItems: 'center',
          // }}
        >
          <Space>
            {hideAccount}
            <DownOutlined />
          </Space>
        </button>
      </Popover>
    </>
  </WalletConnectReact>
);
}