import { useEffect, useMemo, useState } from 'react';
import { AssetSummary } from './AssetSummary';
import indexer from '@/api/indexer';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useTranslation } from 'react-i18next';
import { Wrap, WrapItem } from '@chakra-ui/react';

import { useTokenBalanceSummaryListHook } from '@/hooks/TokenBalanceSummaryList';

interface MyAssetsSummaryProps {
  address: string;
  utxosTotal: number;
  nameTotal: number;
  onChange?: (tick: string) => void;
  onEmpty?: (b: boolean) => void;
}
export const MyAssetsSummary = ({
  address,
  onChange,
  onEmpty,
  utxosTotal,
  nameTotal,
}: MyAssetsSummaryProps) => {
  const { network } = useReactWalletStore((state) => state);
  const { t } = useTranslation();
  const { value } = useTokenBalanceSummaryListHook({ address });
  const otherTickers = useMemo(() => value?.detail || [], [value]);
  const [rareSatList, setRareSatList] = useState<any[]>();
  const [nftSumBalance, setNftBalance] = useState<any>();

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
    return {
      ticker: t('pages.account.ord_nft'),
      balance: nftSumBalance || 0,
    };
  }, [nftSumBalance]);
  const nameTicker = useMemo(() => {
    return {
      ticker: t('pages.account.name'),
      balance: nameTotal || 0,
    };
  }, [nameTotal]);
  const getNfts = async () => {
    try {
      const data = await indexer.nft.getNftListWithAddress({ address, start: 0, limit: 1 });
      setNftBalance(data.data.total);
    } catch (error: any) {
      console.error(error);
    } finally {
      setNftBalance(0);
    }
  };

  const getRareSats = async () => {
    let tmpSats: any[] = [];
    try {
      const data = await indexer.exotic.getExoticSatInfoList({ address: address });
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

  const filteredTickers = useMemo(() => {
    return otherTickers.filter(
      // no show assert for: o(Ordinals NFT), e(Rare), n(Name)
      (ticker) => ticker.type !== "o" && ticker.type !== "e" && ticker.type !== "n",
    );
  }, [otherTickers]);
  const tickers = useMemo(() => {
    return [
      avialableTicker,
      nameTicker,
      rareSatsTicker,
      ordNftTicker,
    ];
  }, [avialableTicker, nameTicker, rareSatsTicker, ordNftTicker]);

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
    getRareSats();
    getNfts();
  }, [address, network]);

  return (
    <div>
      <Wrap>
        {tickers?.map((item, index) => (
          <WrapItem key={index}>
            <AssetSummary
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
        {filteredTickers?.map((item) => (
          <AssetSummary
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
