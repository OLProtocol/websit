import { useState } from 'react';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { OrdxAddressHolders } from '@/components/OrdxAddressHolders';
import { OrdxAccountSummaryList } from '@/components/OrdxAccountSummaryList';
import { UtxoList } from './UtxoList';
import { useTranslation } from 'react-i18next';
import { RareSat } from '@/pages/discover/rareSat';

export const ItemList = () => {
  const { network, currentAccount } = useUnisatConnect();
  const { t } = useTranslation();
  const [utxosTotal, setUtxosTotal] = useState<number>(0);
  const [ticker, setTicker] = useState('');
  const onTotalChange = (total: number) => {
    setUtxosTotal(total);
  }
  return (
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
  );
};
