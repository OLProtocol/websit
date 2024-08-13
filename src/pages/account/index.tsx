import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Sat20AccountSummaryList } from '@/components/Sat20AccountSummaryList';
import { RareSat } from '../discover/rareSat';
import { AvailableUtxoList } from './components/AvailableUtxoList';
import { Sat20AddressHolders } from '@/components/Sat20AddressHolders';
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
    if (total !== 0) {
      setUtxosTotal(total);
    }
  }

  return (
    <div className='max-w-6xl mx-auto pt-4'>
      {address ? (
        <div>
          <Sat20AccountSummaryList
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
            <Sat20AddressHolders tick={ticker} address={address} />
          )}
        </div>
      ) : (
        <div className='text-xl text-center mt-20'>{t('common.hint_connect')}</div>
      )}
    </div>
  );
}
