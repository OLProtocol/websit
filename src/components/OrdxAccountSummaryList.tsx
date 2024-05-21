import { useEffect, useMemo, useState } from 'react';
import { OrdXItem } from './OrdXItem';
import { getSats, useOrdxSummary } from '@/api';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { useTranslation } from 'react-i18next';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { toast } from 'react-hot-toast';

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
  const { network } = useReactWalletStore((state) => state);
  const { t } = useTranslation();
  const { data, trigger } = useOrdxSummary({ address, network });
  const otherTickers = useMemo(() => data?.data?.detail || [], [data]);
  const [rareSatList, setRareSatList] = useState<any[]>();

  const avialableTicker = useMemo(() => {
    return {
      ticker: t('pages.account.available_utxo'),
      balance: utxosTotal,
    };
  }, [utxosTotal]);

  const rareSatsTicker = useMemo(() => {
    let balance = 0;
    if (rareSatList) {
      balance = rareSatList.reduce((acc, sat) => {
        return acc + sat.size;
      }, 0);
    }

    return {
      ticker: t('pages.account.rare_sats'),
      balance: balance,
    };
  }, [rareSatList]);

  const ordNftTicker = useMemo(() => {
    // ordinals nft的ticker名称为“o”
    const tmpTickes = otherTickers.filter((item) => item.ticker === 'o');
    let balance = 0;
    if (tmpTickes.length > 0) {
      tmpTickes.forEach((item) => {
        balance += item.balance;
      })
    }
    return {
      ticker: t('pages.account.ord_nft'),
      balance: balance,
    };
  }, []);

  const getRareSats = async () => {
    const data = await getSats({
      address: address,
      network,
    });
    let tmpSats: any[] = [];
    if (data.code !== 0) {
      tmpSats = [];
    } else {
      for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].sats !== null && data.data[i].sats.length > 0) {
          data.data[i].sats.forEach((item) => {
            // item.id = data.data[i].utxo;
            tmpSats.push(item);
          });
        }
      }
    }

    setRareSatList(tmpSats);
  };

  const [select, setSelect] = useState('');

  const tickers = useMemo(() => {
    return [avialableTicker, rareSatsTicker, ordNftTicker, ...otherTickers];
  }, [otherTickers, avialableTicker, rareSatsTicker, ordNftTicker]);

  const onClick = (item) => {
    const ticker = item.ticker;
    setSelect(ticker);
    onChange?.(ticker);
  };

  useEffect(() => {
    if (tickers.length) {
      onClick(tickers[0]);
    }
  }, [tickers]);

  useEffect(() => {
    onEmpty?.(tickers.length === 0);
  }, [tickers]);

  useEffect(() => {
    trigger();
    getRareSats();
  }, [address, network]);

  return (
    <div>
      <Wrap>
        {tickers.slice(0, 3).map((item) => (
          <WrapItem>
            <OrdXItem
              key={item.ticker}
              selected={select === item.ticker}
              onClick={() => {
                onClick(item);
              }}
              item={{
                tick: item.ticker,
                balance: item.balance,
              }}
            />
          </WrapItem>
        ))}
      </Wrap>
      <hr />
      <div className='max-h-96 w-full flex flex-wrap gap-4 self-stretch overflow-y-auto'>
        {tickers.slice(3).map((item) => (
          <OrdXItem
            key={item.ticker}
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
    </div>
  );
};
