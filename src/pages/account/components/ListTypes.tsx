import { useEffect, useMemo, useState } from 'react';
import { ListTypeItem } from './ListTypeItem';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useTokenBalanceSummaryListHook } from '@/hooks/TokenBalanceSummaryList';

interface ListTypesProps {
  onChange?: (tick: string) => void;
  onEmpty?: (b: boolean) => void;
}
export const ListTypes = ({ onChange, onEmpty }: ListTypesProps) => {
  const { address } = useReactWalletStore();
  const { value } = useTokenBalanceSummaryListHook({ address });

  const [select, setSelect] = useState('');
  const list = useMemo(() => value?.detail || [], [value]);
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
      {/* <ListTypeItem
        selected={select === 'name'}
        onClick={() => {
          onClick({ticker: 'name'});
        }}
        item={{
          tick: 'name',
          balance: '0',
        }}
      /> */}
    </div>
  );
};
