import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UnisatConnectProvider } from '@/provider/UnisatConnectProvider';
import { StyleProvider } from '@ant-design/cssinjs';

function App() {
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
