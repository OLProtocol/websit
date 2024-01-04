import React, { useMemo } from 'react';
import type { MenuProps } from 'antd';
import { Button, Popover, Space, Divider, Tag } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import { Center, useToast } from '@chakra-ui/react';

import { hideStr } from '@/lib/utils';

interface BusButtonProps {
  children?: React.ReactNode;
}
export const BusButton = ({ children }: BusButtonProps) => {
  const toast = useToast();
  const { connectWallet, isConnected, switchNetwork, isUnisatInstalled } =
    useUnisatConnect();
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
    await switchNetwork('testnet');
  };

  return (
    <>
      {isConnected ? (
        <>{children}</>
      ) : (
        <div className='flex justify-center'>
          <Button
            size='large'
            type='primary'
            className='mx-auto'
            onClick={connect}>
            Connect
          </Button>
        </div>
      )}
    </>
  );
};
