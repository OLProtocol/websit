import { useEffect, useMemo, useState } from 'react';
import { OrdXItem } from './OrdXItem';
import { getSats, useOrdxSummary } from '@/api';
import { useUnisatConnect } from '@/lib/hooks';
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
  const [rareSatList, setRareSatList] = useState<any[]>();

  const avialableTicker = useMemo(() => {
    return {
      ticker: t('common.available_utxo'),
      balance: utxosTotal,
    };
  }, [utxosTotal]);

  const rareSatsTicker = useMemo(() => {
    let balance = 0;
    if (rareSatList) {
      balance = rareSatList?.filter((item) => item.type.includes('uncommon')).length
        + rareSatList.filter((item) => item.type.includes('rare')).length
        + rareSatList.filter((item) => item.type.includes('epic')).length
        + rareSatList.filter((item) => item.type.includes('legendary')).length
        + rareSatList.filter((item) => item.type.includes('mythic')).length;
    }
    
    return {
      ticker: t('pages.account.rare_sats'),
      balance: balance,
    };
  }, [rareSatList]);


  const getRareSats = async () => {
    const data = await getSats({
      address: address,
      network,
    });
    if (data.code !== 0) {
      setRareSatList([]);
      return;
    }
    
    let tmpSats: any[] = [];
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].sats !== null && data.data[i].sats.length > 0) {
        data.data[i].sats.forEach((item) => {
          item.id = data.data[i].id;
          tmpSats.push(item);
        })
      }
    }
    setRareSatList(tmpSats);
  }

  const [select, setSelect] = useState('');
  const arr = useMemo(() => data?.data?.detail || [], [data]);
  const list = useMemo(() => {
    return [avialableTicker, ...arr, rareSatsTicker];
  }, [arr, avialableTicker, rareSatsTicker]);
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
    getRareSats();
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
