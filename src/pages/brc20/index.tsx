import { Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Brc20List } from './components/Brc20List';
export default function Brc20Index() {
  return (
    <div>
      <div className='w-[30rem] mx-auto py-10 mb-4'>
        <h1 className='text-2xl text-orange-300 text-center mb-8'>
          Check out brc-20 balance of the address.
        </h1>
        <div className='flex justify-center mb-8'>
          <InputGroup>
            <Input type='search' placeholder='Btc address' />
            <InputRightAddon children={<SearchIcon />} />
          </InputGroup>
        </div>
        <div className='mb-8 text-sm text-center'>
          Recognize all operations including DEPLOY, MINT and TRANSFER.
        </div>
      </div>
      <Brc20List />
    </div>
  );
}
