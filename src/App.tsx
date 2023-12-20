import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { use } from 'i18next';
import { useEffect } from 'react';
import { UnisatConnectProvider } from '@/provider/UnisatConnectProvider';

function App() {
  return (
    <main>
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
  );
}

export default App;
