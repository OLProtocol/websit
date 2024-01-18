import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Ord2FullList } from './components/OrdxFullList';
import { Ord2SummaryList } from './components/OrdxSummaryList';
import { Ord2History } from './components/OrdxHistory';
import { SatBox } from './components/SatBox';
import { ROUTE_PATH } from '@/router';
import { use } from 'i18next';
import { useTranslation } from 'react-i18next';

const { Search } = Input;

export default function Ord2Index() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('tb1prcc8rp5wn0y9vp434kchl3aag8r8hz699006ufvczwnneuqx0wdsfmvq4y');
  const [address, setAddress] = useState('tb1prcc8rp5wn0y9vp434kchl3aag8r8hz699006ufvczwnneuqx0wdsfmvq4y');
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const showAddress = useMemo(() => {
    return address ? true : false;
  }, [address]);
  const doSearch = () => {
    setAddress(search);
    history.replaceState(null, '', `/#/explorer?q=${search}`);
    // nav(`${ROUTE_PATH.ORDX_INDEX}?q=${search}`);
  };
  useEffect(() => {
    if (search === '') {
      setAddress('');
      history.replaceState(null, '', `/#/explorer`);
      // nav(`${ROUTE_PATH.ORDX_INDEX}`);
    }
  }, [search]);
  useEffect(() => {
    if (q) {
      setAddress(q);
      setSearch(q);
    }
  }, [q]);
  return (
    <div>
      <div className='w-[30rem] mx-auto pt-20 mb-4'>
        {!showAddress && (
          <h1 className='text-2xl text-orange-500 text-center mb-8'>
            {t('pages.explorer.subtitle')}
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
            {t('pages.explorer.des')}
          </div>
        )}
      </div>
      <div className='max-w-3xl mx-auto'>
        {showAddress && (
          <>
            <div className='mb-4'>
              <Ord2SummaryList address={address} />
            </div>
            <div>
              {/* <SatBox /> */}
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
