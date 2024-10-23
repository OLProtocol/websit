import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { AccountSummaryList } from '@/components/AccountSummaryList';
import { RareSat } from '../discover/rareSat';
import { AvailableUtxoList } from './components/AvailableUtxoList';
import { AddressHolders } from '@/components/AddressHolders';
import { NftList } from '@/components/NftList';
import { NameList } from '@/components/NameList';
import { useAddressNameListHook } from '@/hooks/NameList';

export default function Account() {
  const { t } = useTranslation();
  const { address } = useReactWalletStore();
  const [utxosTotal, setUtxosTotal] = useState<number>(0);
  const [ticker, setTicker] = useState('');
  const { value } = useAddressNameListHook({ address, start: 0, limit: 1 });

  const onTotalChange = (total: number) => {
    if (total >= 0) {
      setUtxosTotal(total);
    }
  }

  useEffect(() => {
    if (address) {
      console.log('address', address);

    }
  }, [address])

  useEffect(() => {
    if (utxosTotal >= 0) {
      console.log('utxosTotal', utxosTotal);

    }
  }, [utxosTotal])

  const content = (
    <div className='max-w-6xl mx-auto pt-4'>
      {address ? (
        <div>
          <AccountSummaryList
            address={address}
            utxosTotal={utxosTotal}
            nameTotal={value?.data?.total || 0}
            onChange={(tick) => setTicker(tick)}
          />
          {ticker === t('pages.account.name') && (
            <NameList address={address} />
          )}
          {ticker === t('pages.account.rare_sats') && (
            <RareSat canSplit={true} targetAddress={address} />
          )}

          {ticker === t('pages.account.available_utxo') && (
            <AvailableUtxoList address={address} onTotalChange={onTotalChange} />
          )}

          {ticker === t('pages.account.ord_nft') && (
            <NftList targetAddress={address} />
          )}

          {ticker !== t('pages.account.rare_sats') && ticker !== t('pages.account.available_utxo') && (
            <AddressHolders tick={ticker} address={address} />
          )}
        </div>
      ) : (
        <div className='text-xl text-center mt-20'>{t('common.hint_connect')}</div>
      )}
    </div>
  );
  return (
    <div className="flex">
      <div className="w-1/2 pr-2">{content}</div>
      <div className="w-1/2 pl-2">{content}</div>
    </div>
  );
}
