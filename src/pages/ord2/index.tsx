import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Ord2FullList } from './components/Ord2FullList';
import { Ord2SummaryList } from './components/Ord2SummaryList';
import { Ord2History } from './components/Ord2History';
import { ROUTE_PATH } from '@/router';

const { Search } = Input;

export default function Ord2Index() {
  const nav = useNavigate();
  const [address, setAddress] = useState('');
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const showAddress = useMemo(() => {
    return address ? true : false;
  }, [address]);
  const doSearch = () => {
    nav(`${ROUTE_PATH.ORD2_INDEX}?q=${address}`)
  };
  useEffect(() => {
    console.log(q)
    if (q) {
      setAddress(q);
    }
  }, []);
  return (
    <div>
      <div className='w-[30rem] mx-auto pt-20 mb-4'>
        {!showAddress && (
          <h1 className='text-2xl text-orange-500 text-center mb-8'>
            Check out brc-20 balance of the address.
          </h1>
        )}

        <div className='flex justify-center mb-12'>
          <Search
            allowClear
            placeholder='Btc address'
            size='large'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onSearch={doSearch}
          />
        </div>
        {!showAddress && (
          <div className='mb-12 text-sm text-center'>
            Recognize all operations including DEPLOY, MINT and TRANSFER.
          </div>
        )}
      </div>
      <div className='max-w-3xl mx-auto'>
        {showAddress && q && (
          <>
            <div className='mb-4'>
              <Ord2SummaryList address={q} />
            </div>
            <div className='mb-4'>
              <Ord2History tick='BTC' address={q} />
            </div>
          </>
        )}
        {!showAddress && <Ord2FullList />}
      </div>
    </div>
  );
}
