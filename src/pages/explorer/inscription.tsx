import { useParams } from 'react-router-dom';
import { useInscriptiontInfo } from '@/api';
import { useEffect, useState, useMemo } from 'react';
import { Segmented } from 'antd';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { BlockAndTime } from '@/components/BlockAndTime';
import { InfoHolders } from './components/InfoHolders';
import { OrdxTickHistory } from './components/OrdxTickHistory';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { Button, Tag, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/store';

export default function OrdxInscription() {
  const { t } = useTranslation();
  const { inscriptionnum } = useParams();
  const { btcHeight } = useGlobalStore((state) => state);
  const [tabText, setTabText] = useState(t('common.holders'));
  const nav = useNavigate();
  const { network } = useUnisatConnect();
  const handleTabsChange = (type: any) => {
    if (type !== tabText) {
      setTabText(type);
    }
  };
  const { data, trigger, isLoading } = useInscriptiontInfo({
    inscribNum: inscriptionnum,
    network,
  });
  const detail = useMemo(() => data?.data || {}, [data]);

  const satsText = useMemo(() => {
    const ranges =
      detail?.ranges?.map((r: any) =>
        r.size === 1 ? r.start : `${r.start}-${r.start + r.size - 1}`,
      ) || [];
    return ranges.join(', ');
  }, [detail]);
  const ordinalLink = useMemo(() => {
    if (network === 'testnet') {
      return `https://testnet.ordinals.com/inscription/${detail?.inscriptionId}`;
    } else {
      return `https://ordinals.com/inscription/${detail?.inscriptionId}`;
    }
  }, [network, detail]);

  const txid = useMemo(() => {
    return detail?.inscriptionId?.replace(/i0$/m, '');
  }, [detail]);
  const txLink = useMemo(() => {
    if (network === 'testnet') {
      return `https://mempool.space/testnet/tx/${txid}`;
    } else {
      return `https://mempool.space/tx/${txid}`;
    }
  }, [network, txid]);
  useEffect(() => {
    if (inscriptionnum) {
      trigger();
    }
  }, [inscriptionnum, network]);
  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <a href={ordinalLink} className=' text-2xl' target='_blank'>
            <span className='text-orange-400'>#{detail.inscriptionNumber}</span>
          </a>
        </div>
        <div className='border-[1px] border-gray-200 rounded-xl mb-4'>
          <div className='border-b-[1px] border-gray-200 flex justify-between px-4 h-10 items-center'>
            <span> {t('common.overview')} </span>
          </div>
          <div className='p-4'>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.inscriptionId')}:</p>
              <a href={ordinalLink} className='indent-2' target='_blank'>
                {detail?.inscriptionId || '-'}
              </a>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.tick')}:</p>
              <p className='indent-2'>{detail?.ticker || '-'}</p>
            </div>
            <div className=''>
              <p className='text-gray-400'>Sats Ranges:</p>
              <p className='indent-2'>{satsText || '-'}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.quantity')}:</p>
              <p className='indent-2'>{detail?.amount}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.deploy_time')}:</p>
              <p className='indent-2'>
                {new Date(detail?.mintTimes).toLocaleString()}
              </p>
            </div>

            <div className=''>
              <p className='text-gray-400'>{t('common.genesisTx')}:</p>
              <a href={txLink} className='indent-2' target='_blank'>
                {txid || '-'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}