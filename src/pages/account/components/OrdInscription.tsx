/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { useNavigate, useParams } from 'react-router-dom';
import { useOrdInscriptiontInfo } from '@/swr';
import { useEffect, useMemo } from 'react';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { generateMempoolUrl } from '@/lib/utils';
import { useNetwork } from '@/lib/wallet';

export default function OrdInscription() {
  const { t } = useTranslation();
  const { inscriptionId } = useParams();
  const network = useNetwork();
  const nav = useNavigate();

  const { resp, trigger, isLoading } = inscriptionId ? useOrdInscriptiontInfo(inscriptionId) : { resp: undefined, trigger: () => {}, isLoading: false };
  const detail = useMemo(() => resp?.data , [resp]);

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
    const href = generateMempoolUrl({
      network,
      path: `tx/${txid}`,
    });
    return href;
  }, [network, txid]);


  useEffect(() => {
    if (inscriptionId) {
      trigger();
    }
  }, [inscriptionId, network]);

  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        {/* <div className='flex justify-between mb-4 items-center'>
          <a href={ordinalLink} className=' text-2xl' target='_blank'>
            {detail?.inscription?.number === 9223372036854775807 ? (
              <span className='text-orange-400'>{detail?.inscriptionId}</span>
            ) : (
              <span className='text-orange-400'>
                #{detail?.inscription?.number}
              </span>
            )}
          </a>
        </div> */}

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

            <div className=''>
              <p className='text-gray-400'>Sat:</p>
              <p className='indent-2'>{detail?.sat}</p>
            </div>
            {/* <div className='mb-2'>
              <p className='text-gray-400'>Fee:</p>
              <p className='indent-2'>{detail?.inscription?.fee}</p>
            </div> */}
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.deploy_time')}:</p>
              <p className='indent-2'>
                {detail && new Date(detail?.time).toLocaleString('af')}
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
1704364685000
1704891712