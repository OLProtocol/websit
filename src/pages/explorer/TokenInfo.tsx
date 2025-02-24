import { useParams } from 'react-router-dom';
import { useTickerStatus } from '@/swr';
import { useEffect, useState, useMemo } from 'react';
import { Segmented } from 'antd';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { BlockAndTime } from '@/components/BlockAndTime';
import { InfoHolders } from './components/InfoHolders';
import { TickHistory } from './components/TickHistory';
import { generateMempoolUrl, genOrdServiceUrl, genOrdinalsUrl, getAssetTypeLabel } from '@/lib/utils';
import { Button, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';
import { useNetwork } from '@/lib/wallet';

export default function TokenInfo() {
  const { t } = useTranslation();
  const { ticker } = useParams();
  const { btcHeight } = useCommonStore((state) => state);
  const [tabText, setTabText] = useState(t('common.holders'));
  const nav = useNavigate();
  const network = useNetwork();

  const { VITE_ORDX_MINT_URL } = import.meta.env;

  const handleTabsChange = (type: any) => {
    if (type !== tabText) {
      setTabText(type);
    }
  };
  const validTicker = typeof ticker === 'string' ? ticker : '';
  const { data: tickerStatus, isLoading } = useTickerStatus({ ticker: validTicker });
  const status = useMemo(() => {
    let _status = '';
    if (!tickerStatus) {
      return _status;
    }
    const isSpecial = tickerStatus.rarity !== 'unknow' && tickerStatus.rarity !== 'common' && !!tickerStatus.rarity;

    if (!isSpecial && tickerStatus.startBlock < 0) {
      if (tickerStatus.max > 0 && tickerStatus.totalMinted < tickerStatus.max) {
        _status = 'Minting';
      } else if (tickerStatus.max < 0) {
        _status = 'Minting';
      }
    } else if (isSpecial && tickerStatus.startBlock < 0) {
      if (tickerStatus.max > 0 && tickerStatus.totalMinted < tickerStatus.max) {
        _status = 'Minting';
      } else if (tickerStatus.max < 0) {
        _status = 'Minting';
      }
    } else if (
      tickerStatus.startBlock &&
      tickerStatus.endBlock &&
      btcHeight <= tickerStatus.endBlock &&
      btcHeight >= tickerStatus.startBlock
    ) {
      if (tickerStatus.max > 0 && tickerStatus.totalMinted < tickerStatus.max) {
        _status = 'Minting';
      } else if (tickerStatus.max < 0) {
        _status = 'Minting';
      }
    } else if (btcHeight < tickerStatus.startBlock) {
      _status = 'Pending';
    } else {
      _status = 'Completed';
    }
    return _status;
  }, [tickerStatus, btcHeight]);
  const toInscribe = () => {
    console.log(tickerStatus);
    const url = VITE_ORDX_MINT_URL.replace('%s', tickerStatus?.ticker);
    window.open(url, '_blank');
    // nav('/inscribe', {
    //   state: {
    //     type: 'ordx',
    //     item: {
    //       tick: detail.ticker,
    //       rarity: detail.rarity,
    //       limit: detail.limit,
    //     },
    //   },
    // });
  };
  const attr = useMemo(() => {
    const { rarity } = tickerStatus || {};
    const attrArr: string[] = [];
    if (rarity !== 'unknow' && rarity !== 'common' && !!rarity) {
      attrArr.push(`rar=${rarity}`);
    }
    let _attr;
    if (attrArr.length > 0) {
      _attr = attrArr.join(';');
    }
    return _attr;
  }, [tickerStatus]);
  
  const ordinalLink = useMemo(() => {
    return genOrdinalsUrl({
      network,
      path: `inscription/${tickerStatus?.inscriptionId}`,
    });
  }, [network, tickerStatus]);
  const txLink = useMemo(() => {
    const href = generateMempoolUrl({
      network,
      path: `tx/${tickerStatus?.txid}`,
    });
    return href;
  }, [network, tickerStatus]);
  const showContent = useMemo(() => {
    return tickerStatus?.contenttype === 'text/html' || !!tickerStatus?.delegate;
  }, [tickerStatus])
  const showContentId = useMemo(() => {
    return tickerStatus?.delegate ?? tickerStatus?.inscriptionId;
  }, [tickerStatus])
  useEffect(() => {

  }, [ticker, network]);
  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <span className='text-orange-400 text-2xl '>{getAssetTypeLabel(ticker)}</span>
          <span>
            {status === 'Pending' && (
              <Tag color='orange'>{t('common.waiting')}</Tag>
            )}
            {status === 'Minting' && (
              <Button type='link' onClick={toInscribe}>
                {t('common.minting')}
              </Button>
            )}
            {status === 'Completed' && (
              <Tag color='blue'>{t('common.completed')}</Tag>
            )}
          </span>
        </div>
        <div className='border-[1px] border-gray-200 rounded-xl mb-4'>
          <div className='border-b-[1px] border-gray-200 flex justify-between px-4 h-10 items-center'>
            <span> {t('common.overview')} </span>
          </div>
          <div className='p-4'>
            {showContent && (
              <div className='mb-2'>
                <p className='text-gray-400'>{t('common.content')}:</p>
                <div>
                  <iframe
                    src={genOrdServiceUrl({
                      network,
                      path: `preview/${showContentId}`,
                    })}
                    scrolling='no'
                    sandbox='allow-scripts'
                    className='max-w-full w-80 h-80'></iframe>
                </div>
              </div>
            )}

            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.inscriptionId')}:</p>
              <a href={ordinalLink} className='indent-2' target='_blank'>
                {tickerStatus?.inscriptionId || '-'}
              </a>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.description')}:</p>
              <p className='indent-2'>{tickerStatus?.description || '-'}</p>
            </div>

            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.block')}:</p>
              <div className='indent-2 flex'>
                {tickerStatus && tickerStatus.startBlock > 0 && tickerStatus.endBlock > 0 ? (
                  <BlockAndTime
                    startBlock={tickerStatus?.startBlock}
                    endBlock={tickerStatus?.endBlock}
                  />
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.deploy_height')}:</p>
              <p className='indent-2'>{tickerStatus?.deployHeight}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.limit_per_mint')}:</p>
              <p className='indent-2'>{tickerStatus?.limit}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.max')}:</p>
              <p className='indent-2'>{tickerStatus && tickerStatus.max > 0 ? tickerStatus.max : '-'}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.selfmint')}:</p>
              <p className='indent-2'>
                {tickerStatus?.selfmint ? `${tickerStatus?.selfmint}%` : '-'}
              </p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.deploy_time')}:</p>
              <p className='indent-2'>
                {tickerStatus?.deployBlocktime
                  ? new Date(tickerStatus?.deployBlocktime * 1000).toLocaleString(
                    'af',
                  )
                  : '-'}
              </p>
            </div>
            <div className=''>
              <p className='text-gray-400'>{t('common.holders')}:</p>
              <p className='indent-2'>{tickerStatus?.holdersCount}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.minted_total')}:</p>
              <p className='indent-2'>
                {tickerStatus?.totalMinted}
                {ticker === 'Pearl' && (
                  <>
                    <span>(</span>
                    <a
                      href='https://gateway.pinata.cloud/ipfs/QmWwNrzrKVYyaEFCVrJEWC2pqsDSmVSkBmaYvmBoToAC3c'
                      target='_blank'>
                      {t('common.minted_history_data_file')}
                    </a>
                    <span>)</span>
                  </>
                )}
                {ticker === '龙' && (
                  <>
                    <span>(</span>
                    <a
                      href='https://gateway.pinata.cloud/ipfs/QmSM1y5evXoadcXNh4prKp31zgcV6bqxfPjkp9sRjyiszk'
                      target='_blank'>
                      {t('common.minted_history_data_file')}
                    </a>
                    <span>)</span>
                  </>
                )}
              </p>
            </div>
            <div className=''>
              <p className='text-gray-400'>{t('common.satAttr')}:</p>
              <p className='indent-2'>{attr || '-'}</p>
            </div>
            <div className=''>
              <p className='text-gray-400'>{t('common.deployTx')}:</p>
              <a href={txLink} className='indent-2' target='_blank'>
                {tickerStatus?.txid || '-'}
              </a>
            </div>
          </div>
        </div>
        <div className='border-[1px] border-gray-200 rounded-xl'>
          <div className='border-b-[1px] border-gray-200 flex justify-between px-4 h-14 items-center'>
            <Segmented
              options={[t('common.holders'), t('common.minted_history')]}
              block
              onChange={handleTabsChange}
              className='w-72'
            />
          </div>
          {tabText === t('common.holders') &&
            ticker &&
            tickerStatus?.totalMinted !== undefined && (
              <div className='p-4'>
                <InfoHolders ticker={ticker} totalQuantity={tickerStatus?.totalMinted} />
              </div>
            )}
          {tabText === t('common.minted_history') && ticker && (
            <div className='p-4'>
              <TickHistory tick={ticker} />
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
}
