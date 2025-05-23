/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { useNavigate, useParams } from 'react-router-dom';
import { useInscriptiontInfo } from '@/swr';
import { useEffect, useMemo } from 'react';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { Spin } from 'antd';
import { UtxoContent } from '@/components/UtxoContent';
import { useTranslation } from 'react-i18next';
import { generateMempoolUrl, genOrdinalsUrl } from '@/lib/utils';
import { useNetwork } from '@/lib/wallet';
import { MintDetailInfoResp } from '@/api/type';
import { TriggerWithoutArgs } from 'swr/mutation';

export default function Inscription() {
  const { t } = useTranslation();
  const { inscriptionId } = useParams();
  const network = useNetwork();
  const nav = useNavigate();
  const { data: detail, trigger, isLoading } = inscriptionId ? useInscriptiontInfo(inscriptionId) : { data: undefined, trigger: () => {}, isLoading: false };

  const satsText = useMemo(() => {
    const ranges =
      detail?.ranges?.map((r: any) =>
        r.size === 1 ? r.start : `${r.start}-${r.start + r.size - 1}`,
      ) || [];
    return ranges.join(', ');
  }, [detail]);

  const ordinalLink = useMemo(() => {
    return genOrdinalsUrl({
      network,
      path: `inscription/${detail?.inscriptionId}`,
    });
  }, [network, detail]);

  const delegateInscriptionId = useMemo(() => {
    if (!detail?.delegate) {
      return;
    } else {
      return `${detail?.delegate}i0`;
    }
  }, [detail?.delegate]);

  const txid = useMemo(() => {
    return detail?.inscriptionId?.split('i')[0];
  }, [detail]);

  const txLink = useMemo(() => {
    const href = generateMempoolUrl({
      network,
      path: `tx/${txid}`,
    });
    return href;
  }, [network, txid]);

  const toTick = () => {
    if (detail?.ticker) {
      nav(`/explorer/${detail.ticker}`);
    }
  };

  useEffect(() => {
    if (inscriptionId) {
      trigger();
    }
  }, [inscriptionId, network]);

  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <a href={ordinalLink} className=' text-2xl' target='_blank'>
            {detail?.inscriptionNumber === 9223372036854775807 ? (
              <span className='text-orange-400'>{detail.inscriptionId}</span>
            ) : (
              <span className='text-orange-400'>
                #{detail?.inscriptionNumber}
              </span>
            )}
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
            {!!detail?.delegate && (
              <div className='mb-2'>
                <p className='text-gray-400'>{t('common.content')}:</p>
                <div className='h-80'>
                  <UtxoContent
                    inscriptionId={detail?.inscriptionId || ''}
                  />
                </div>
              </div>
            )}

            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.tick')}:</p>
              <a onClick={toTick} className='indent-2' target='_blank'>
                {detail?.ticker || '-'}
              </a>
            </div>
            <div>
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
                {detail && detail.mintTimes && new Date(detail.mintTimes * 1000).toLocaleString('af')}
              </p>
            </div>

            <div>
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
