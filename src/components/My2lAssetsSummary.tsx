import { useEffect, useMemo, useState } from 'react';
import { AssetSummary } from './AssetSummary';
import { useTranslation } from 'react-i18next';
import { Wrap, WrapItem } from '@chakra-ui/react';


interface My2lAssetsSummaryProps {
  address: string;
  utxosTotal: number;

  onChange?: (tick: string) => void;
  onEmpty?: (b: boolean) => void;
}
export const My2lAssetsSummary = ({
  onChange,
  onEmpty,
  utxosTotal,

}: My2lAssetsSummaryProps) => {
  
  const { t } = useTranslation();
  const avialableTicker = useMemo(() => {
    return {
      ticker: t('pages.account.available_utxo'),
      balance: utxosTotal,
    };
  }, [t, utxosTotal]);


  const [select, setSelect] = useState('');


  const tickers = useMemo(() => {
    return [
      avialableTicker,
    ];
  }, [avialableTicker]);

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
  }, [onChange, tickers]);

  useEffect(() => {
    onEmpty?.(tickers.length === 0);
  }, [onEmpty, tickers]);

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
                ticker: item.ticker,
                balance: typeof item.balance === 'number' ? item.balance.toString() : (item.balance || 'undefined'),
              }}
            />
          </WrapItem>
        ))}
      </Wrap>

    </div>
  );
};
