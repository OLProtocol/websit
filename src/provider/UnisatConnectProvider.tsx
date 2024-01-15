import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { useInterval } from 'react-use';
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
  switchNetwork: (n?: string) => Promise<void>;
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
  const [unisatNetwork, setUnisatNetwork] = useState('testnet'); // Default network
  const toast = useToast();
  const checkUnisat = async () => {
    const unisat = window.unisat;
    setIsConnected(false);
    setBalance({
      confirmed: 0,
      unconfirmed: 0,
      total: 0,
    });
    if (unisat) {
      setIsUnisatInstalled(true);
      try {
        // Check the current network
        const currentNetwork = await unisat.getNetwork();
        setUnisatNetwork(currentNetwork);

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
  useEffect(() => {
    checkUnisat();
  }, []);
  useInterval(() => {
    checkUnisat();
  }, 30000);
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

  const switchNetwork = async (n) => {
    const unisat = window.unisat;
    if (unisat) {
      try {
        const newNetwork = unisatNetwork === 'livenet' ? 'testnet' : 'livenet';
        await unisat.switchNetwork(n || newNetwork);
        setUnisatNetwork(n || newNetwork);

        // After switching the network, refresh the account details
        const accounts = await unisat.getAccounts();

        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          const newBalance = await unisat.getBalance(accounts[0]);
          console.log('newBalance', newBalance);
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
  const network = useMemo(() => {
    return unisatNetwork === 'livenet' ? 'main' : 'testnet';
  }, [unisatNetwork]);
  useEffect(() => {
    if (window.unisat) {
      window.unisat.on('accountsChanged', async (accounts) => {
        console.log('accounts', accounts);
        if (accounts.length > 0) {
          setIsConnected(true);
          setCurrentAccount(accounts[0]);
          const newBalance = await window.unisat.getBalance(accounts[0]);
          console.log('newBalance', newBalance);
          setBalance(newBalance);
        } else {
          setIsConnected(false);
          setCurrentAccount('');
          setBalance({ confirmed: 0, unconfirmed: 0, total: 0 });
        }
      });
      console.log(window.unisat);
      window.unisat.on('networkChanged', (network) => {
        setUnisatNetwork(network);
      });
    }
  }, []);
  console.log('network', network);
  console.log('currentAccount', currentAccount);
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
