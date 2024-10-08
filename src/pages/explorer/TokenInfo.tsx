import { useParams } from 'react-router-dom';
import { useTokenInfo } from '@/api';
import { useEffect, useState, useMemo } from 'react';
import { Segmented } from 'antd';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { BlockAndTime } from '@/components/BlockAndTime';
import { InfoHolders } from './components/InfoHolders';
import { TickHistory } from './components/TickHistory';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { generateMempoolUrl, genOrdServiceUrl, genOrdinalsUrl, getAssetTypeLabel } from '@/lib/utils';
import { Button, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';
import { useNetwork } from '@/lib/wallet';

export default function TokenInfo() {
  const { t } = useTranslation();
  const { tick } = useParams();
  const { btcHeight } = useCommonStore((state) => state);
  const [tabText, setTabText] = useState(t('common.holders'));
  const nav = useNavigate();
  const network = useNetwork();


  const { VITE_ORDX_MINT_URL } = import.meta.env;
  // VITE_ORDX_MINT_URL is https://ordx.market/inscribe?ticker=%s

  const handleTabsChange = (type: any) => {
    if (type !== tabText) {
      setTabText(type);
    }
  };
  const { resp: tokenInfoResp, isLoading } = useTokenInfo({ tick });
  const detail = useMemo(() => {
    return tokenInfoResp?.data || {};
  },
    [tokenInfoResp]
  );

  const status = useMemo(() => {
    let _status;
    if (!detail.ticker) {
      return _status;
    }
    const isSpecial = detail.rarity !== 'unknow' && detail.rarity !== 'common' && !!detail.rarity;

    if (!isSpecial && detail.startBlock < 0) {
      if (detail.max > 0 && detail.totalMinted < detail.max) {
        _status = 'Minting';
      } else if (detail.max < 0) {
        _status = 'Minting';
      }
    } else if (isSpecial && detail.startBlock < 0) {
      if (detail.max > 0 && detail.totalMinted < detail.max) {
        _status = 'Minting';
      } else if (detail.max < 0) {
        _status = 'Minting';
      }
    } else if (
      detail.startBlock &&
      detail.endBlock &&
      btcHeight <= detail.endBlock &&
      btcHeight >= detail.startBlock
    ) {
      if (detail.max > 0 && detail.totalMinted < detail.max) {
        _status = 'Minting';
      } else if (detail.max < 0) {
        _status = 'Minting';
      }
    } else if (btcHeight < detail.startBlock) {
      _status = 'Pending';
    } else {
      _status = 'Completed';
    }
    return _status;
  }, [detail, btcHeight]);
  const toInscribe = () => {
    console.log(detail);
    const url = VITE_ORDX_MINT_URL.replace('%s', detail.ticker);
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
    const { rarity } = detail || {};
    const attrArr: string[] = [];
    if (rarity !== 'unknow' && rarity !== 'common' && !!rarity) {
      attrArr.push(`rar=${rarity}`);
    }
    let _attr;
    if (attrArr.length > 0) {
      _attr = attrArr.join(';');
    }
    return _attr;
  }, [detail]);
  const specialStatus = useMemo(() => !!attr, [attr]);
  const ordinalLink = useMemo(() => {
    return genOrdinalsUrl({
      network,
      path: `inscription/${detail?.inscriptionId}`,
    });
  }, [network, detail]);
  const txLink = useMemo(() => {
    const href = generateMempoolUrl({
      network,
      path: `tx/${detail?.txid}`,
    });
    return href;
  }, [network, detail]);
  const showContent = useMemo(() => {
    return detail?.contenttype === 'text/html' || !!detail?.delegate;
  }, [detail])
  const showContentId = useMemo(() => {
    return detail?.delegate ?? detail?.inscriptionId;
  }, [detail])
  useEffect(() => {

  }, [tick, network]);
  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <span className='text-orange-400 text-2xl '>{getAssetTypeLabel(tick)}</span>
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
                {detail?.inscriptionId || '-'}
              </a>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.description')}:</p>
              <p className='indent-2'>{detail?.description || '-'}</p>
            </div>

            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.block')}:</p>
              <div className='indent-2 flex'>
                {detail?.startBlock > 0 && detail?.endBlock > 0 ? (
                  <BlockAndTime
                    startBlock={detail.startBlock}
                    endBlock={detail.endBlock}
                  />
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.deploy_height')}:</p>
              <p className='indent-2'>{detail?.deployHeight}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.limit_per_mint')}:</p>
              <p className='indent-2'>{detail?.limit}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.max')}:</p>
              <p className='indent-2'>{detail?.max > 0 ? detail?.max : '-'}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.selfmint')}:</p>
              <p className='indent-2'>
                {detail?.selfmint ? `${detail?.selfmint}%` : '-'}
              </p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.deploy_time')}:</p>
              <p className='indent-2'>
                {detail?.deployBlocktime
                  ? new Date(detail?.deployBlocktime * 1000).toLocaleString(
                    'af',
                  )
                  : '-'}
              </p>
            </div>
            <div className=''>
              <p className='text-gray-400'>{t('common.holders')}:</p>
              <p className='indent-2'>{detail?.holdersCount}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.minted_total')}:</p>
              <p className='indent-2'>
                {detail?.totalMinted}
                {tick === 'Pearl' && (
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
                {tick === '龙' && (
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
                {detail?.txid || '-'}
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
            tick &&
            detail?.totalMinted !== undefined && (
              <div className='p-4'>
                <InfoHolders tick={tick} totalQuantity={detail?.totalMinted} />
              </div>
            )}
          {tabText === t('common.minted_history') && tick && (
            <div className='p-4'>
              <TickHistory tick={tick} />
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
}
