import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UnisatConnectProvider } from '@/provider/UnisatConnectProvider';
import { StyleProvider } from '@ant-design/cssinjs';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';


function App() {
  const { t, i18n } = useTranslation();

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
  }

  useEffect(() => {
    const defaultLanguage = i18n.language;
    // changeLanguage(defaultLanguage);
  }, [i18n.language]);
  
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
        <UnisatConnectProvider>
          <ChakraProvider>
            <RouterProvider router={router}></RouterProvider>
          </ChakraProvider>
        </UnisatConnectProvider>
      </main>
    </StyleProvider>
  );
}

export default App;
