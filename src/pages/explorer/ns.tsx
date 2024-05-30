import { useParams } from 'react-router-dom';
import { useNsName } from '@/api';
import { useEffect, useState, useMemo } from 'react';
import { Segmented } from 'antd';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { BlockAndTime } from '@/components/BlockAndTime';
import { InfoHolders } from './components/InfoHolders';
import { OrdxTickHistory } from './components/OrdxTickHistory';
import { useReactWalletStore } from 'btc-connect/dist/react';

import { Button, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';

export default function Ord2Info() {
  const { t } = useTranslation();
  const { name } = useParams();
  console.log(name);
  const { btcHeight } = useCommonStore((state) => state);
  const [tabText, setTabText] = useState(t('common.holders'));
  const nav = useNavigate();
  const { network } = useReactWalletStore();
  const handleTabsChange = (type: any) => {
    if (type !== tabText) {
      setTabText(type);
    }
  };
  const { data, trigger, isLoading } = useNsName({ name, network });
  const detail = useMemo(() => data?.data || {}, [data]);

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
    if (name) {
      trigger();
    }
  }, [name, network]);
  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <span className='text-orange-400 text-2xl '>{name}</span>
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
                  <iframe
                    src={`https://ord-${
                      network === 'testnet' ? 'testnet' : 'mainnet'
                    }.ordx.space/preview/${detail?.inscriptionId}`}
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
        </div>
      </div>
    </Spin>
  );
}
