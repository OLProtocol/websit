import { useReactWalletStore } from 'btc-connect/dist/react';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { OrdxAccountSummaryList } from '@/components/OrdxAccountSummaryList';
import { RareSat } from '../discover/rareSat';
import { AvailableUtxoList } from './components/AvailableUtxoList';
import { OrdxAddressHolders } from '@/components/OrdxAddressHolders';
import { useNsListByAddress } from '@/api'
import { NftList } from './components/NftList';
import { NameList } from './components/NameList';

export default function Account() {
  const { t } = useTranslation();
  const { network, address: currentAccount } = useReactWalletStore();
  const [utxosTotal, setUtxosTotal] = useState<number>(0);
  const [ticker, setTicker] = useState('');

  const { data } = useNsListByAddress({
    address: currentAccount,
    start: 0,
    limit: 1,
    network,
  });
  const nameTotal = useMemo(() => data?.data?.amount || 0, [data]);

  const onTotalChange = (total: number) => {
    setUtxosTotal(total);
  }

  return (
    <div className='max-w-6xl mx-auto pt-4'>
      {currentAccount !== '' ? (
        <div>
          <OrdxAccountSummaryList
            address={currentAccount}
            utxosTotal={utxosTotal}
            nameTotal={nameTotal}
            onChange={(tick) => setTicker(tick)}
          />
          {ticker === t('pages.account.name') && (
            <NameList />
          )}
          {ticker === t('pages.account.rare_sats') && (
            <RareSat canSplit={true} />
          )}

          {ticker === t('pages.account.available_utxo') && (
            <AvailableUtxoList address={currentAccount} onTotalChange={onTotalChange} />
          )}

          {ticker === t('pages.account.ord_nft') && (
            <NftList />
          )}

          {ticker !== t('pages.account.rare_sats') && ticker !== t('pages.account.available_utxo') && (
            <OrdxAddressHolders tick={ticker} address={currentAccount} />
          )}
        </div>
      ) : (
        <div className='text-xl text-center mt-20'>{t('common.hint_connect')}</div>
      )}
    </div>
  );
}
