
import { useEffect, useMemo, useState } from 'react';
import { Input, Empty, Segmented } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { OrdxList } from '@/pages/explorer/components/OrdxList';
import { AccountSummaryList } from '@/components/AccountSummaryList';
import { useTranslation } from 'react-i18next';
import { NameList } from '@/components/NameList';
import { NftList } from '@/components/NftList';
import { RareSat } from '@/pages/discover/rareSat';
import { AvailableUtxoList } from '@/pages/account/components/AvailableUtxoList';
import { AddressHolders } from '@/components/AddressHolders';
import { useNetwork } from '@/lib/wallet';
import { useAddressNameListHook } from '@/hooks/NameList';

const { Search } = Input;

export default function Index() {
  const [address, setAddress] = useState('');
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [summaryEmptyStatus, setSummaryEmptyStatus] = useState(false);
  const [historyEmptyStatus, setHistoryEmptyStatus] = useState(false);
  const [selectTick, setSelectTick] = useState('');
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  const network = useNetwork();
  const [utxosTotal, setUtxosTotal] = useState<number>(0);
  const { value } = useAddressNameListHook({ address, start: 0, limit: 1 });

  const onTotalChange = (total: number) => {
    if (total !== 0) {
      setUtxosTotal(total);
    }
  }

  const showAddress = useMemo(() => {
    return address ? true : false;
  }, [address]);
  const doSearch = () => {
    if (search === '') {
      return;
    }
    setAddress(search);
    history.replaceState(null, '', `/#/explorer?q=${search}`);
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
      setAddress('');
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
      </div>
      <div className='max-w-7xl mx-auto px-4'>
        {(showAddress && address != "") && (
          <>
            {empty && (
              <div className='mb-4'>
                <Empty />
              </div>
            )}
            <div className='mb-4'>
              <AccountSummaryList
                onEmpty={summaryEmptyHandler}
                address={address}
                utxosTotal={utxosTotal}
                nameTotal={value?.data?.total || 0}
                onChange={(tick) => setSelectTick(tick)}
              />
            </div>
            {selectTick === t('pages.account.available_utxo') && (
              <AvailableUtxoList address={address} onTotalChange={onTotalChange} />
            )}
            {selectTick === t('pages.account.name') && (
              <NameList address={address} />
            )}
            {selectTick === t('pages.account.rare_sats') && (
              <RareSat canSplit={true} targetAddress={address} />
            )}
            {selectTick === t('pages.account.ord_nft') && (
              <NftList targetAddress={address} />
            )}
            {selectTick !== t('pages.account.rare_sats') && selectTick !== t('pages.account.available_utxo') && (
              <AddressHolders tick={selectTick} address={address} />
            )}
          </>
        )}
        {!showAddress && (
          <div>
            <OrdxList />
          </div>
        )}
      </div>
    </div>
  );
}
