import { useEffect, useMemo, useState } from 'react';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { useOrdxAddressHistory } from '@/api';

export const ItemList = () => {
  const { network, currentAccount } = useUnisatConnect();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, trigger } = useOrdxAddressHistory({
    ticker: 'Pearl',
    address: currentAccount,
    network,
    start,
    limit,
  });
  console.log(data)
  return (
    <div className='flex gap-2 max-w-xl mx-auto p-2'>
      
    </div>
  );
}