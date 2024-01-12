import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Ord2FullList } from './components/OrdxFullList';
import { Ord2SummaryList } from './components/OrdxSummaryList';
import { Ord2History } from './components/OrdxHistory';
import { ROUTE_PATH } from '@/router';
import { use } from 'i18next';

const { Search } = Input;

export default function Ord2Index() {
  const nav = useNavigate();
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const showAddress = useMemo(() => {
    return address ? true : false;
  }, [address]);
  const doSearch = () => {
    setAddress(search);
    history.replaceState(null, '', `/#/ordx?q=${search}`);
    // nav(`${ROUTE_PATH.ORDX_INDEX}?q=${search}`);
  };
  useEffect(() => {
    if (search === '') {
      setAddress('');
      history.replaceState(null, '', `/#/ordx`);
      // nav(`${ROUTE_PATH.ORDX_INDEX}`);
    }
  }, [search]);
  useEffect(() => {
    if (q) {
      setAddress(q);
      setSearch(q);
    }
  }, [q]);
  console.log('q', q)
  console.log('showAddress', showAddress)
  console.log('address', address)
  return (
    <div>
      <div className='w-[30rem] mx-auto pt-20 mb-4'>
        {!showAddress && (
          <h1 className='text-2xl text-orange-500 text-center mb-8'>
            Check out OrdX balance of the address.
          </h1>
        )}

        <div className='flex justify-center mb-12'>
          <Search
            allowClear
            placeholder='Btc address'
            size='large'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        {showAddress && (
          <>
            <div className='mb-4'>
              <Ord2SummaryList address={address} />
            </div>
            <div className='mb-4'>
              <Ord2History tick='BTC' address={address} />
            </div>
          </>
        )}
        {!showAddress && <Ord2FullList />}
      </div>
    </div>
  );
}
