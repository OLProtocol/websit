import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, Space } from 'antd';
import { SearchIcon } from '@chakra-ui/icons';
import { Ord2FullList } from './components/Ord2FullList';

export default function Ord2Index() {
  const { Search } = Input;
  return (
    <div>
      <div className='w-[30rem] mx-auto py-10 mb-4'>
        <h1 className='text-2xl text-orange-300 text-center mb-8'>
          Check out brc-20 balance of the address.
        </h1>
        <div className='flex justify-center mb-8'>
          <Search placeholder='Btc address' size='large'/>
        </div>
        <div className='mb-8 text-sm text-center'>
          Recognize all operations including DEPLOY, MINT and TRANSFER.
        </div>
      </div>
      <Ord2FullList />
    </div>
  );
}
