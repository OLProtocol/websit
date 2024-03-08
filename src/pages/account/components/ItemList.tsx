import { useEffect, useMemo, useState } from 'react';
import { Pagination, Spin } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { useOrdxAddressHistory } from '@/api';
import { OrdxItem } from './OrdxItem';
import { ListTypes } from './ListTypes';

export const ItemList = () => {
  const { network, currentAccount } = useUnisatConnect();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [ticker, setTicker] = useState('');
  const { data, isLoading, trigger } = useOrdxAddressHistory({
    ticker,
    address: currentAccount,
    network,
    start,
    limit,
  });
  const list = useMemo(() => {
    return data?.data?.detail || [];
  }, [data]);
  const total = useMemo(() => {
    return data?.data?.total || [];
  }, [data]);
  useEffect(() => {
    if (currentAccount && network && ticker) {
      trigger();
    }
  }, [currentAccount, network, ticker, start, limit]);
  console.log(data);
  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
    setLimit(pageSize);
  };
  return (
    <div>
      <div className='mb-4'>
        <ListTypes onChange={(t) => setTicker(t)} />
      </div>
      <div className='grid grid-cols-4 gap-3 mb-4 relative'>
        {isLoading && (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
            <Spin className='' />
          </div>
        )}
        {list.map((item) => {
          return <OrdxItem key={item.id} item={item} />;
        })}
      </div>
      {total > 0 && (
        <div className='flex justify-center'>
          <Pagination
            total={total}
            onChange={paginationChange}
            showTotal={(total) => `Total ${total} items`}
            defaultPageSize={limit}
            defaultCurrent={1}
          />
        </div>
      )}
    </div>
  );
};
