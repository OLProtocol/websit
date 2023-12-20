import React, { useMemo } from 'react';
import { Button, Badge } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import { useToast } from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { hideStr } from '@/lib/utils';
import { disconnect } from 'process';

export const UnisatConnectButton = () => {
  const toast = useToast();
  const unisat = useUnisat();
  const {
    currentAccount,
    isConnected,
    balance,
    network,
    isUnisatInstalled,
    connectWallet,
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
  };
  const hideAccount = useMemo(() => {
    return hideStr(currentAccount, 4);
  }, [currentAccount]);
  return (
    <>
      {isConnected ? (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {hideAccount}
          </MenuButton>
          <MenuList className='px-2'>
            <div className='flex justify-center items-center'>
              {balance.total} SAT
              <div className='ml-2 flex items-center'>
                <Badge colorScheme='red'>{network}</Badge>
              </div>
            </div>

            <MenuDivider />
            <div className='flex justify-center'>
              <Button onClick={disconnect}>Disconnect</Button>
            </div>
          </MenuList>
        </Menu>
      ) : (
        <Button onClick={connect}>Connect</Button>
      )}
    </>
  );
};
