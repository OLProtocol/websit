import { useParams } from 'react-router-dom';
import { useOrdxInfo } from '@/api';
import { useEffect, useState, useMemo } from 'react';
import { Segmented } from 'antd';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { BlockAndTime } from '@/components/BlockAndTime';
import { InfoHolders } from './components/InfoHolders';
import { OrdxTickHistory } from './components/OrdxTickHistory';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { Button, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';

export default function Ord2Info() {
  const { t } = useTranslation();
  const { tick } = useParams();
  const { btcHeight } = useCommonStore((state) => state);
  const [tabText, setTabText] = useState(t('common.holders'));
  const nav = useNavigate();
  const { network } = useUnisatConnect();
  const handleTabsChange = (type: any) => {
    if (type !== tabText) {
      setTabText(type);
    }
  };
  const { data, trigger, isLoading } = useOrdxInfo({ tick, network });
  const detail = useMemo(() => data?.data || {}, [data]);

  const status = useMemo(() => {
    let _status;
    if (
      detail?.rarity !== 'unknow' &&
      detail?.rarity !== 'common' &&
      !!detail?.rarity
    ) {
      _status = 'Minting';
    } else if (
      detail?.startBlock &&
      detail?.endBlock &&
      btcHeight <= detail?.endBlock &&
      btcHeight >= detail?.startBlock
    ) {
      _status = 'Minting';
    } else if (btcHeight < detail?.startBlock) {
      _status = 'Pending';
    } else {
      _status = 'Completed';
    }
    return _status;
  }, [detail, btcHeight]);
  const toInscribe = () => {
    console.log(detail);
    nav('/inscribe', {
      state: {
        type: 'ordx',
        item: {
          tick: detail.ticker,
          rarity: detail.rarity,
          limit: detail.limit,
        },
      },
    });
  };
  const attr = useMemo(() => {
    const { rarity, cn, trz } = detail || {};
    const attrArr: string[] = [];
    if (rarity !== 'unknow' && rarity !== 'common' && !!rarity) {
      attrArr.push(`rar=${rarity}`);
    }
    if (cn !== undefined) {
      attrArr.push(`cn=${cn}`);
    }
    if (trz !== undefined) {
      attrArr.push(`trz=${trz}`);
    }
    let _attr;
    if (attrArr.length > 0) {
      _attr = attrArr.join(';');
    }
    return _attr;
  }, [detail]);
  const specialStatus = useMemo(() => !!attr, [attr]);
  const ordinalLink = useMemo(() => {
    if (network === 'testnet') {
      return `https://testnet.ordinals.com/inscription/${detail?.inscriptionId}`;
    } else {
      return `https://ordinals.com/inscription/${detail?.inscriptionId}`;
    }
  }, [network, detail]);
  const txLink = useMemo(() => {
    if (network === 'testnet') {
      return `https://mempool.space/testnet/tx/${detail?.txid}`;
    } else {
      return `https://mempool.space/tx/${detail?.txid}`;
    }
  }, [network, detail]);
  useEffect(() => {
    if (tick) {
      trigger();
    }
  }, [tick, network]);
  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <span className='text-orange-400 text-2xl '>{tick}</span>
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
            {!!detail?.imgtype && (
              <div className='mb-2'>
                <p className='text-gray-400'>{t('common.content')}:</p>
                <div>
                  <img
                    src={`https://${
                      network === 'testnet' ? 'testnet.' : ''
                    }ordinals.com/content/${detail?.inscriptionId}`}
                    className='max-w-full w-80 h-80'></img>
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
                {/* {specialStatus
                  ? '-'
                  : <BlockAndTime startBlock={detail?}/>} */}
                {specialStatus && '-'}
                {!!(
                  !specialStatus &&
                  detail?.startBlock &&
                  detail?.endBlock
                ) && (
                  <BlockAndTime
                    startBlock={detail.startBlock}
                    endBlock={detail.endBlock}
                  />
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
              <p className='text-gray-400'>{t('common.deploy_time')}:</p>
              <p className='indent-2'>
                {new Date(detail?.deployBlocktime).toLocaleString('af')}
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

            {/* <div className=''>
              <p className='text-gray-400'>{t('common.rarity')}:</p>
              <p className='indent-2'>
                {detail?.rarity && detail?.rarity !== 'unknow' ? (
                  <Tag color='green' key={detail?.rarity}>
                    {detail?.rarity}
                  </Tag>
                ) : (
                  '-'
                )}
              </p>
            </div>
            <div className=''>
              <p className='text-gray-400'>{t('common.trz')}:</p>
              <p className='indent-2'>{detail?.trz || '-'}</p>
            </div> */}
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
              className='w-52'
            />
          </div>
          {tabText === t('common.holders') && tick && detail?.totalMinted && (
            <div className='p-4'>
              <InfoHolders tick={tick} totalQuantity={detail?.totalMinted} />
            </div>
          )}
          {tabText === t('common.minted_history') && tick && (
            <div className='p-4'>
              <OrdxTickHistory tick={tick} />
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
}
