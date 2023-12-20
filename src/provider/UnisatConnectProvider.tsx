import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@chakra-ui/react';

declare global {
  interface Window {
    unisat: any;
  }
}

interface Balance {
  confirmed: number;
  unconfirmed: number;
  total: number;
}

interface ConnectionContextProps {
  isUnisatInstalled: boolean;
  isConnected: boolean;
  balance: Balance;
  currentAccount: string;
  network: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
}

export const ConnectionContext = createContext<ConnectionContextProps>(
  {} as ConnectionContextProps,
);



interface ConnectionProviderProps {
  children: ReactNode;
}

export const UnisatConnectProvider: React.FC<ConnectionProviderProps> = ({
  children,
}) => {
  const [isUnisatInstalled, setIsUnisatInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<Balance>({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [currentAccount, setCurrentAccount] = useState('');
  const [network, setNetwork] = useState('testnet'); // Default network
  const toast = useToast();
  useEffect(() => {
    const checkUnisat = async () => {
      const unisat = window.unisat;
      if (unisat) {
        setIsUnisatInstalled(true);
        try {
          // Check the current network
          const currentNetwork = await unisat.getNetwork();
          setNetwork(currentNetwork);

          // Check for accounts and balance
          const accounts = await unisat.getAccounts();
          if (accounts.length > 0) {
            setIsConnected(true);
            setCurrentAccount(accounts[0]);
            const balance = await unisat.getBalance(accounts[0]);
            setBalance(balance);
          }
        } catch (error) {
          console.error('Error checking Unisat status:', error);
          toast({
            title: 'Could not check Unisat status',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    checkUnisat();
  }, []);

  const connectWallet = async () => {
    const unisat = window.unisat;
    if (unisat) {
      try {
        const accounts = await unisat.requestAccounts();
        if (accounts.length > 0) {
          setIsConnected(true);
          setCurrentAccount(accounts[0]);
          const newBalance = await unisat.getBalance(accounts[0]);
          setBalance(newBalance);
        }
      } catch (error) {
        console.error('Error connecting to Unisat:', error);
        toast({
          title: 'Could not connect to Unisat',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setCurrentAccount('');
    setBalance({ confirmed: 0, unconfirmed: 0, total: 0 });
  };

  const switchNetwork = async () => {
    const unisat = window.unisat;
    if (unisat) {
      try {
        const newNetwork = network === 'livenet' ? 'testnet' : 'livenet';
        await unisat.switchNetwork(newNetwork);
        setNetwork(newNetwork);

        // After switching the network, refresh the account details
        const accounts = await unisat.getAccounts();
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          const newBalance = await unisat.getBalance(accounts[0]);
          setBalance(newBalance);
        } else {
          // Handle the case where no accounts are found after the network switch
          setIsConnected(false);
          setCurrentAccount('');
          setBalance({ confirmed: 0, unconfirmed: 0, total: 0 });
        }
      } catch (error) {
        console.error('Error switching network:', error);
        toast({
          title: 'Could not switch network',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <ConnectionContext.Provider
      value={{
        isUnisatInstalled,
        isConnected,
        balance,
        currentAccount,
        network,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default UnisatConnectProvider;
