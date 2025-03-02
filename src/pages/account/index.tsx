import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { My1lAssetsSummary } from '@/components/My1lAssetsSummary';
import { My2lAssetsSummary } from '@/components/My2lAssetsSummary';
import { RareSat } from '../discover/rareSat';
import { AvailableUtxoList } from './components/AvailableUtxoList';
import { AddressHolders } from '@/components/AddressHolders';
import { MyNftList } from '@/components/MyNftList';
import { NameList } from '@/components/NameList';
import { useMyNameListHook } from '@/hooks/MyNameList';
import { DisplayAsset, IndexerLayer, NameList as NameListResp } from '@/api/type';
import { useAddressAssetsSummaryHook } from '@/hooks/useAddressAssetsSummary';
import { MyRuneList } from '@/components/MyRuneList';
import BigNumber from 'bignumber.js';

export default function Account() {
  const { t } = useTranslation();
  const { address } = useReactWalletStore();

  const [baseUtxosTotal, setBaseUtxosTotal] = useState<number>(0);
  const [satsnetUtxosTotal, setSatsnetUtxosTotal] = useState<number>(0);

  const [baseTicker, setBaseIndexTicker] = useState('');
  const [satsnetTicker, setSatsnetIndexTicker] = useState('');

  const { value: baseNameListResp } = useMyNameListHook({ address, start: 0, limit: 1 }, IndexerLayer.Base);
  // const { value: runeListResp } = useRuneListHook({ address, start: 0, limit: 1 }, IndexerLayer.Base);
  
  const { value: baseAddressAssetsSummary } = useAddressAssetsSummaryHook({ address }, IndexerLayer.Base);
  const baseRuneSummary: DisplayAsset[] = useMemo(() => {
    const ret: DisplayAsset[] = [];
    for (const assetSummary of baseAddressAssetsSummary) {
      if (assetSummary.Name.Protocol === 'runes' && assetSummary.Name.Type === 'f') {
        ret.push(assetSummary);
      }
    }
    return ret;
  }, [baseAddressAssetsSummary]);

  const baseRuneTotal = useMemo(() => {
    let total = new BigNumber('0', 10);
    for (const rune of baseRuneSummary) {
      const value = new BigNumber(rune.Amount, 10);
      total = total.plus(value);
    }
    console.log('total', total.toString());
    return total.toString();
  }, [baseRuneSummary]);
    
  const firstLayerAssets = (indexerLayer: IndexerLayer,
    assetType: string, setAssetType: Dispatch<SetStateAction<string>>,
    utxosTotal: number, setUtxosTotal: Dispatch<SetStateAction<number>>,
    nameListResp: NameListResp | undefined
  ) => (
    <div className='max-w-6xl mx-auto pt-4'>
      {assetType}
      {address ? (
        <div>
          <My1lAssetsSummary
            indexerLayer={indexerLayer}
            address={address}
            utxosTotal={utxosTotal}
            nameTotal={nameListResp?.total || 0}
            onChange={(assetType) => setAssetType(assetType)}
            runeTotal={baseRuneTotal}
          />
          {assetType === t('pages.account.available_utxo') && (
            <AvailableUtxoList
              address={address}
              onTotalChange={(total: number) => {
                if (total >= 0) {
                  setUtxosTotal(total);
                }
              }}
              indexerLayer={indexerLayer} />
          )}
          {assetType === t('pages.account.name') && (
            <NameList address={address} indexerLayer={indexerLayer} />
          )}
          {assetType === t('pages.account.rare_sats') && (
            <RareSat canSplit={true} targetAddress={address} indexerLayer={indexerLayer} />
          )}
          {assetType === t('pages.account.ord_nft') && (
            <MyNftList targetAddress={address} indexerLayer={indexerLayer} />
          )}
          {assetType === t('pages.account.runes') && (
            <MyRuneList baseRuneSummary={baseRuneSummary}/>
          )}
          {/* {ticker !== t('pages.account.rare_sats') && ticker !== t('pages.account.available_utxo') && (
            <AddressHolders ticker={ticker} address={address} indexerLayer={indexerLayer} />
          )} */}
        </div>
      ) : (
        <div className='text-xl text-center mt-20'>{t('common.hint_connect')}</div>
      )}
    </div>
  );

  const secondLayerAssets = (indexerLayer: IndexerLayer,
    ticker: string, setTicker: Dispatch<SetStateAction<string>>,
    utxosTotal: number, setUtxosTotal: Dispatch<SetStateAction<number>>,
  ) => (
    <div className='max-w-6xl mx-auto pt-4'>
      {address ? (
        <div>
          <My2lAssetsSummary
            address={address}
            utxosTotal={utxosTotal}
            onChange={(ticker) => setTicker(ticker)}
          />
          {ticker === t('pages.account.available_utxo') && (
            <AvailableUtxoList
              address={address}
              onTotalChange={(total: number) => {
                if (total >= 0) {
                  setUtxosTotal(total);
                }
              }}
              indexerLayer={indexerLayer} />
          )}
        </div>
      ) : (
        <div className='text-xl text-center mt-20'>{t('common.hint_connect')}</div>
      )}
    </div>
  );
  return (
    <div className="flex">
      <div className="w-1/2 pr-2">
      {/* <h2 className="text-2xl font-bold text-center mb-4">一层</h2> */}
      <h2 className="text-2xl font-bold text-center mb-4 py-2 bg-blue-100 text-blue-700 rounded-lg shadow">{t('pages.account.first_layer')}</h2>
        {firstLayerAssets(
          IndexerLayer.Base,
          baseTicker, setBaseIndexTicker,
          baseUtxosTotal, setBaseUtxosTotal,
          baseNameListResp)}
      </div>
      <div className="w-1/2 pl-2">
      {/* <h2 className="text-2xl font-bold text-center mb-4">二层</h2> */}
      <h2 className="text-2xl font-bold text-center mb-4 py-2 bg-green-100 text-green-700 rounded-lg shadow">{t('pages.account.second_layer')}</h2>
        {secondLayerAssets(IndexerLayer.Satsnet,
          satsnetTicker, setSatsnetIndexTicker,
          satsnetUtxosTotal, setSatsnetUtxosTotal,
          )}
      </div>
    </div>
  );
}
