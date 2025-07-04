
import { useEffect, useMemo, useState } from 'react';
import { Input, Empty, Segmented } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { OrdxList } from '@/pages/explorer/components/OrdxList';
import { My1lAssetsSummary } from '@/components/My1lAssetsSummary';
import { useTranslation } from 'react-i18next';
import { NameList } from '@/components/NameList';
import { MyNftList } from '@/components/MyNftList';
import { RareSat } from '@/pages/discover/rareSat';
import { AvailableUtxoList } from '@/pages/account/components/AvailableUtxoList';
import { AddressHolders } from '@/components/AddressHolders';
import { useMyNameListHook } from '@/hooks/MyNameList';
import { DisplayAsset, IndexerLayer } from '@/api/type';
import { useAddressAssetsSummaryHook } from '@/hooks/useAddressAssetsSummary';
import BigNumber from 'bignumber.js';
import { MyRuneList } from '@/components/MyRuneList';

const { Search } = Input;

export default function Index() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');
  const [summaryEmptyStatus, setSummaryEmptyStatus] = useState(false);
  const [historyEmptyStatus, setHistoryEmptyStatus] = useState(false);
  const [selectTick, setSelectTick] = useState('');
  const [utxosTotal, setUtxosTotal] = useState<number>(0);

  const { value: resp } = useMyNameListHook({ address, start: 0, limit: 1 }, IndexerLayer.Base);
  const { value: baseAddressAssetsSummary = [] } = useAddressAssetsSummaryHook({ address }, IndexerLayer.Base);
  
  const baseRuneSummary: DisplayAsset[] = useMemo(() => {
    const ret: DisplayAsset[] = [];
    for (const assetSummary of baseAddressAssetsSummary) {
      if (assetSummary.Name.Protocol === 'runes' && assetSummary.Name.Type === 'f') {
        ret.push(assetSummary);
      }
    }
    return ret;
  }, [baseAddressAssetsSummary]);

  const ordxSummary: DisplayAsset[] = useMemo(() => {
    const ret: DisplayAsset[] = [];
    for (const assetSummary of baseAddressAssetsSummary) {
      if (assetSummary.Name.Protocol === 'ordx' && assetSummary.Name.Type === 'f') {
        ret.push(assetSummary);
      }
    }
    return ret;
  }, [baseAddressAssetsSummary]);

  const baseRuneTotal = useMemo(() => {
    let total = new BigNumber('0', 10);
    for (const rune of baseRuneSummary) {
      const value = new BigNumber(rune.Amount, 10);
      total = total.plus(value);
    }
    const ret = total.toString();
    return ret;
  }, [baseRuneSummary]);

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
    const basePath = window.location.pathname;
    history.replaceState(null, '', `${basePath}#/explorer?q=${search}`);
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
              <My1lAssetsSummary
                indexerLayer={IndexerLayer.Base}
                onEmpty={summaryEmptyHandler}
                address={address}
                utxosTotal={utxosTotal}
                nameTotal={resp?.total || 0}
                runeTotal={baseRuneTotal}
                ordxSummary={ordxSummary}
                onChange={(tick) => setSelectTick(tick)}
              />
            </div>
            {selectTick === t('pages.account.available_utxo') && (
              <AvailableUtxoList address={address} onTotalChange={onTotalChange} indexerLayer={IndexerLayer.Base} />
            )}
            {selectTick === t('pages.account.name') && (
              <NameList address={address} indexerLayer={IndexerLayer.Base} />
            )}
            {selectTick === t('pages.account.rare_sats') && (
              <RareSat canSplit={true} targetAddress={address} indexerLayer={IndexerLayer.Base} />
            )}
            {selectTick === t('pages.account.ord_nft') && (
              <MyNftList targetAddress={address} indexerLayer={IndexerLayer.Base} />
            )}
            {selectTick === t('pages.account.runes') && (
              <MyRuneList baseRuneSummary={baseRuneSummary} />
            )}
            {selectTick !== t('pages.account.available_utxo') && selectTick !== t('pages.account.name') &&
            selectTick !== t('pages.account.rare_sats') && selectTick !== t('pages.account.ord_nft') && selectTick !== t('pages.account.runes') && (
              <AddressHolders ticker={selectTick} address={address} indexerLayer={IndexerLayer.Base} />
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
