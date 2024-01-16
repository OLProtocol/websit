import React, { useMemo } from 'react';
import { Button } from 'antd';
import { useUnisatConnect,  } from '@/lib/hooks/unisat';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface BusButtonProps {
  children?: React.ReactNode;
}
export const BusButton = ({ children }: BusButtonProps) => {
  const { t } = useTranslation();
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
            {t('buttons.connect')}
          </Button>
        </div>
      )}
    </>
  );
};
