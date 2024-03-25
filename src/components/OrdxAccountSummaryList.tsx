import { useEffect, useMemo, useState } from 'react';
import { OrdXItem } from './OrdXItem';
import { useOrdxSummary, useUtxoByValue } from '@/api';
import { useUnisatConnect } from '@/lib/hooks';
import { on } from 'events';
import { useTranslation } from 'react-i18next';
interface OrdxSummaryListProps {
  address: string;
  utxosTotal?: number;
  onChange?: (tick: string) => void;
  onEmpty?: (b: boolean) => void;
}
export const OrdxAccountSummaryList = ({
  address,
  onChange,
  onEmpty,
  utxosTotal,
}: OrdxSummaryListProps) => {
  const { network } = useUnisatConnect();
  const { t } = useTranslation();
  const { data, trigger } = useOrdxSummary({ address, network });

  const avialableTicker = useMemo(() => {
    return {
      ticker: t('common.available_utxo'),
      balance: utxosTotal,
    };
  }, [utxosTotal]);
  const [select, setSelect] = useState('');
  const arr = useMemo(() => data?.data?.detail || [], [data]);
  const list = useMemo(() => {
    return [avialableTicker, ...arr];
  }, [arr, avialableTicker]);
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
    trigger();
  }, [address, network]);
  return (
    <div className='max-h-96 w-full flex flex-wrap gap-4 self-stretch overflow-y-auto'>
      {list.map((item) => (
        <OrdXItem key={item.ticker}
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
