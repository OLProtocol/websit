import { useEffect, useMemo, useState } from 'react';
import { Pagination, Spin } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { useOrdxAddressHolders } from '@/api';
import { OrdxAddressHolders } from '@/components/OrdxAddressHolders';
import { OrdxAccountSummaryList } from '@/components/OrdxAccountSummaryList';
import { UtxoList } from './UtxoList';
import { ListTypes } from './ListTypes';

export const ItemList = () => {
  const { network, currentAccount } = useUnisatConnect();

  const [ticker, setTicker] = useState('');

  return (
    <div>
      <div className='mb-4'>
        <OrdxAccountSummaryList
          address={currentAccount}
          onChange={(tick) => setTicker(tick)}
        />
      </div>
      {ticker === '可花费utxo' ? (
        <UtxoList address={currentAccount} tick={ticker}/>
      ) : (
        <OrdxAddressHolders tick={ticker} address={currentAccount} />
      )}
    </div>
  );
};
