import { useEffect, useMemo, useState } from 'react';
import { useOrdxSummary } from '@/api';
import { ListTypeItem } from './ListTypeItem';
import { useUnisatConnect } from '@/lib/hooks';

interface ListTypesProps {
  onChange?: (tick: string) => void;
  onEmpty?: (b: boolean) => void;
}
export const ListTypes = ({
  onChange,
  onEmpty,
}: ListTypesProps) => {
  const { network, currentAccount } = useUnisatConnect();
  const { data, trigger } = useOrdxSummary({ address: currentAccount, network });
  const [select, setSelect] = useState('');
  const list = useMemo(() => data?.data?.detail || [], [data]);
  const onClick = (item) => {
    setSelect(item.ticker);
    onChange?.(item.ticker);
  };
  useEffect(() => {
    if (list.length) {
      onClick(list[0]);
    }
  }, [list]);
  useEffect(() => {
    onEmpty?.(list.length === 0);
  }, [list]);
  useEffect(() => {
    if (currentAccount) {
      trigger();
    }
  }, [currentAccount, network]);
  return (
    <div className='max-h-96 w-full flex flex-wrap gap-4 self-stretch overflow-y-auto'>
      {list.map((item) => (
        <ListTypeItem
          selected={select === item.ticker}
          onClick={() => {
            onClick(item);
          }}
          item={{
            tick: item.ticker,
            balance: item.balance,
          }}
        />
      ))}
    </div>
  );
};
