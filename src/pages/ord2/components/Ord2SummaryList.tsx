import { useOrd2Summary } from '@/api';
import { useMemo } from 'react';
import { Ord2Item } from './Ord2Item';
interface Ord2SummaryListProps {
  address: string;
}
export const Ord2SummaryList = ({ address }: Ord2SummaryListProps) => {
  const { data } = useOrd2Summary({ address });
  const list = useMemo(() => data?.detail || [], [data]);
  return (
    <div className='max-h-96 w-full flex flex-wrap gap-4 self-stretch overflow-y-auto'>
      {list.map((item) => (
        <Ord2Item
          item={{
            tick: item.ticker,
            transferable: item.transferableBalance,
            available: item.availableBalance,
            balance: item.overallBalance,
          }}
        />
      ))}
    </div>
  );
};
