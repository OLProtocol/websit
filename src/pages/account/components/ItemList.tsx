import { useEffect, useMemo, useState } from 'react';
import { Pagination, Spin } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { useOrdxAddressHolders } from '@/api';
import { OrdxAddressHolders } from '@/components/OrdxAddressHolders';
import { OrdxSummaryList } from '@/components/OrdxSummaryList';
import { OrdxItem } from './OrdxItem';
import { ListTypes } from './ListTypes';

export const ItemList = () => {
  const { network, currentAccount } = useUnisatConnect();

  const [ticker, setTicker] = useState('');

  return (
    <div>
      <div className='mb-4'>
        <OrdxSummaryList
          address={currentAccount}
          onChange={(tick) => setTicker(tick)}
        />
      </div>

      <OrdxAddressHolders tick={ticker} address={currentAccount} />
    </div>
  );
};
