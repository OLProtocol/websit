import { useUnisatConnect } from '@/lib/hooks';
import { useTranslation } from 'react-i18next';
import { ItemList } from './components/ItemList';
import { useState } from 'react';
import { OrdxAccountSummaryList } from '@/components/OrdxAccountSummaryList';
import { RareSat } from '../discover/rareSat';
import { UtxoList } from './components/UtxoList';
import { OrdxAddressHolders } from '@/components/OrdxAddressHolders';

export default function Account() {
  const { t } = useTranslation();
  const { network, currentAccount } = useUnisatConnect();
  const [utxosTotal, setUtxosTotal] = useState<number>(0);
  const [ticker, setTicker] = useState('');
  const onTotalChange = (total: number) => {
    setUtxosTotal(total);
  }

  return (
    <div className='max-w-6xl mx-auto pt-4'>
      {currentAccount !== '' ? (
        <div>
          <div className='mb-4'>
            <OrdxAccountSummaryList
              address={currentAccount}
              utxosTotal={utxosTotal}
              onChange={(tick) => setTicker(tick)}
            />
          </div>
          {ticker === t('pages.account.rare_sats') && (
            <RareSat canSplit={true} />
          )}
          {ticker === t('pages.account.available_utxo') && (
            <UtxoList address={currentAccount} tick={ticker} onTotalChange={onTotalChange} />
          )}
          {ticker !== t('pages.account.rare_sats') && ticker !== t('pages.account.available_utxo') && ticker !== t('pages.account.ord_nft') && (
            <OrdxAddressHolders tick={ticker} address={currentAccount} />
          )}
        </div>
      ) : (
        <div className='text-xl text-center mt-20'>{t('common.hint_connect')}</div>
      )}
    </div>
  );
}
