import { SearchOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { Ord2FullList } from './components/Ord2FullList';

export default function Ord2Index() {
  const { Search } = Input;
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const showAddress = useMemo(() => {
    return q ? true : false;
  }, [q]);
  console.log(showAddress);
  return (
    <div>
      <div className='w-[30rem] mx-auto py-10 mb-4'>
        {!showAddress && (
          <h1 className='text-2xl text-orange-300 text-center mb-8'>
            Check out brc-20 balance of the address.
          </h1>
        )}

        <div className='flex justify-center mb-8'>
          <Search placeholder='Btc address' size='large' />
        </div>
        {!showAddress && (
          <div className='mb-8 text-sm text-center'>
            Recognize all operations including DEPLOY, MINT and TRANSFER.
          </div>
        )}
      </div>
      {showAddress && <div></div>}
      {!showAddress && <Ord2FullList />}
    </div>
  );
}
