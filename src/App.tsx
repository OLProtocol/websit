import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { StyleProvider } from '@ant-design/cssinjs';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { BtcWalletConnectOptions, BtcWalletNetwork, useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { getNetwork } from './lib/wallet';

function App() {
  const { t, i18n } = useTranslation();
  const { init } = useReactWalletStore();

  useEffect(() => {
    const config: BtcWalletConnectOptions = {
      network: getNetwork() as BtcWalletNetwork,
    };
    init(config);

  }, [init]);

  useEffect(() => {
    const defaultLanguage = i18n.language;
    i18n.changeLanguage(defaultLanguage);
  }, [i18n, i18n.language]);

  return (
    <StyleProvider hashPriority='high'>
      <main className='h-full'>
        <Toaster
          containerStyle={{ zIndex: 9999999, wordBreak: 'break-all' }}
          position='top-center'
          reverseOrder={false}
          toastOptions={{
            duration: 2000,
          }}
        />
        <ChakraProvider>
          <RouterProvider router={router}></RouterProvider>
        </ChakraProvider>
      </main>
    </StyleProvider>
  );
}

export default App;
