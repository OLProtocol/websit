import { useEffect, useMemo, useState } from 'react';
import { AssetSummary } from './AssetSummary';
import indexer from '@/api/indexer';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useTranslation } from 'react-i18next';
import { Wrap, WrapItem } from '@chakra-ui/react';

import { DisplayAsset, IndexerLayer } from '@/api/type';
import { ListTypeItem } from '@/pages/account/components/ListTypeItem';

interface My1lAssetsSummaryProps {
  address: string;
  utxosTotal: number;
  nameTotal: number;
  indexerLayer: IndexerLayer;
  onChange?: (tick: string) => void;
  onEmpty?: (b: boolean) => void;
  runeTotal?: string;
  ordxSummary?: DisplayAsset[];
}
export const My1lAssetsSummary = ({
  address,
  onChange,
  onEmpty,
  utxosTotal,
  nameTotal,
  indexerLayer,
  runeTotal,
  ordxSummary,
}: My1lAssetsSummaryProps) => {
  const { network } = useReactWalletStore((state) => state);
  const { t } = useTranslation();

  const [rareSatList, setRareSatList] = useState<any[]>();
  const [nftSumBalance, setNftBalance] = useState<string>();

  const avialableTicker = useMemo(() => {
    return {
      ticker: t('pages.account.available_utxo'),
      balance: utxosTotal,
    };
  }, [t, utxosTotal]);

  const runeTicker = useMemo(() => {
    return {
      ticker: t('pages.account.runes'),
      balance: runeTotal,
    };
  }, [runeTotal, t]);

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
  }, [rareSatList, t]);

  const ordNftTicker = useMemo(() => {
    return {
      ticker: t('pages.account.ord_nft'),
      balance: nftSumBalance,
    };
  }, [nftSumBalance, t]);
  const nameTicker = useMemo(() => {
    return {
      ticker: t('pages.account.name'),
      balance: nameTotal,
    };
  }, [nameTotal, t]);
  const getNfts = async () => {
    const data = await indexer.nft.getNftListWithAddress({address,start: 0,limit: 1}, indexerLayer);
    let sum = 0;
    if (data.code !== 0) {
      sum = 0;
    } else {
      sum = data.data.total;
    }
    setNftBalance(sum.toString());
  };

  const getRareSats = async () => {
    const tmpSats: any[] = [];
    try {
      const data = await indexer.exotic.getExoticSatInfoList({ address }, indexerLayer);
      for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].sats !== null && data.data[i].sats.length > 0) {
          data.data[i].sats.forEach((item) => {
            tmpSats.push(item);
          });
        }
      }
      setRareSatList(tmpSats);
    } catch (error: any) {
      console.error(error);
    }
  };

  const [select, setSelect] = useState('');
  const tickers = useMemo(() => {
    return [
      avialableTicker,
      nameTicker,
      rareSatsTicker,
      ordNftTicker,
      runeTicker,
    ];
  }, [avialableTicker, nameTicker, rareSatsTicker, ordNftTicker, runeTicker]);

  const onClick = (item) => {
    const ticker = item.ticker;
    setSelect(ticker);
    onChange?.(ticker);
  };

  useEffect(() => {
    if (tickers.length) {
      const ticker = tickers[0].ticker;
      setSelect(ticker);
      onChange?.(ticker);
    }
  }, [tickers]);

  useEffect(() => {
    onEmpty?.(tickers.length === 0);
  }, [tickers]);

  useEffect(() => {
    getRareSats();
    getNfts();
  }, [address,  network]);

  return (
    <div>
      <Wrap spacing="0" className="px-4">
        {tickers?.map((item, index) => (
          <WrapItem key={index}>
            <AssetSummary
              key={item.ticker}
              selected={select === item.ticker}
              onClick={() => {
                onClick(item);
              }}
              item={{
                ticker: item.ticker,
                balance: typeof item.balance === 'number' ? item.balance.toString() : (item.balance || 'undefined'),
              }}
            />
          </WrapItem>
        ))}
      </Wrap>
      <div className='w-full flex flex-wrap self-stretch overflow-y-auto px-4'>
        {ordxSummary?.map((item) => (
          <ListTypeItem
            key={item.Name.Ticker}
            selected={select === item.Name.Ticker}
            onClick={() => {
              onClick(item);
            }}
            item={{
              tick: item.Name.Ticker,
              balance: item.Amount,
            }}
          />
        ))}
      </div>
    </div>
  );
};
