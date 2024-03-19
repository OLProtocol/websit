import { useEffect, useMemo, useState } from 'react';
import { Input, Empty } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useCommonStore } from '@/store';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { Ord2FullList } from './components/OrdxFullList';
import { OrdxSummaryList } from '../../components/OrdxSummaryList';
import { OrdxAddressHolders } from '../../components/OrdxAddressHolders';
import { useTranslation } from 'react-i18next';

const { Search } = Input;

export default function Ord2Index() {
  const { btcHeight } = useCommonStore((state) => state);
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');
  const [summaryEmptyStatus, setSummaryEmptyStatus] = useState(false);
  const [historyEmptyStatus, setHistoryEmptyStatus] = useState(false);
  const [selectTick, setSelectTick] = useState('');
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const showAddress = useMemo(() => {
    return address ? true : false;
  }, [address]);
  const doSearch = () => {
    if (search === '') {
      return;
    }
    setAddress(search);
    history.replaceState(null, '', `/#/explorer?q=${search}`);
    // nav(`${ROUTE_PATH.ORDX_INDEX}?q=${search}`);
  };
  const summaryEmptyHandler = (b: boolean) => {
    setSummaryEmptyStatus(b);
  };
  const historyEmptyHandler = (b: boolean) => {
    setHistoryEmptyStatus(b);
  };

  const empty = useMemo(() => {
    return summaryEmptyStatus && historyEmptyStatus;
  }, [summaryEmptyStatus, historyEmptyStatus]);
  useEffect(() => {
    if (search === '') {
      console.log(search);
      setAddress('');
      // history.replaceState(null, '', `/#/explorer`);
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
      <BtcHeightAlert />
      <div className='max-w-[40rem] mx-auto pt-20 mb-4'>
        {!showAddress && (
          <>
            <h1 className='text-2xl text-orange-500 text-center mb-2'>
              {t('pages.explorer.subtitle')}
            </h1>
            {/* <h2 className='text-sm text-gray-500 text-center mb-6'>
              {t('pages.explorer.not_support')}
            </h2> */}
          </>
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
        {/* {!showAddress && (
          <div className='mb-12 text-sm text-center'>
            {t('pages.explorer.des')}
          </div>
        )} */}
      </div>
      <div className='max-w-7xl mx-auto px-4'>
        {showAddress && (
          <>
            {empty && (
              <div className='mb-4'>
                <Empty />
              </div>
            )}
            <div className='mb-4'>
              <OrdxSummaryList
                onEmpty={summaryEmptyHandler}
                address={address}
                onChange={(tick) => setSelectTick(tick)}
              />
            </div>
            <div className='mb-4'>
              <OrdxAddressHolders
                onEmpty={historyEmptyHandler}
                tick={selectTick}
                address={address}
              />
            </div>
          </>
        )}
        {!showAddress && <Ord2FullList />}
      </div>
    </div>
  );
}
