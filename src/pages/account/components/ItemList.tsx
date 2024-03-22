import { useEffect, useMemo, useState } from 'react';
import { Pagination, Spin } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { OrdxAddressHolders } from '@/components/OrdxAddressHolders';
import { OrdxAccountSummaryList } from '@/components/OrdxAccountSummaryList';
import { UtxoList } from './UtxoList';
import { ListTypes } from './ListTypes';

export const ItemList = () => {
  const { network, currentAccount } = useUnisatConnect();
  const [utxosTotal, setUtxosTotal] = useState<number>(0);
  const [ticker, setTicker] = useState('');
  const onTotalChange = (total: number) => {
    console.log('total:', total);
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
      {ticker === '可花费utxo' ? (
        <UtxoList address={currentAccount} tick={ticker} onTotalChange={onTotalChange} />
      ) : (
        <OrdxAddressHolders tick={ticker} address={currentAccount} />
      )}
    </div>
  );
};
