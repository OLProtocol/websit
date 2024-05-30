import { useNavigate, useParams } from 'react-router-dom';
import { useOrdInscriptiontInfo } from '@/api';
import { useEffect, useState, useMemo } from 'react';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';

export default function OrdInscription() {
  const { t } = useTranslation();
  const { inscriptionId } = useParams();
  const { network } = useReactWalletStore();
  const nav = useNavigate();

  const { data, trigger, isLoading } = useOrdInscriptiontInfo({
    inscriptionId: inscriptionId,
    network,
  });

  const detail = useMemo(() => data?.data || {}, [data]);

  const ordinalLink = useMemo(() => {
    if (network === 'testnet') {
      return `https://testnet.ordinals.com/inscription/${detail?.inscription?.id}`;
    } else {
      return `https://ordinals.com/inscription/${detail?.inscription?.id}`;
    }
  }, [network, detail]);

  
  const txid = useMemo(() => {
    return detail?.inscription?.id?.replace(/i0$/m, '');
  }, [detail]);

  const txLink = useMemo(() => {
    if (network === 'testnet') {
      return `https://mempool.space/testnet/tx/${txid}`;
    } else {
      return `https://mempool.space/tx/${txid}`;
    }
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
        <div className='flex justify-between mb-4 items-center'>
          <a href={ordinalLink} className=' text-2xl' target='_blank'>
            {detail?.inscription?.number === 9223372036854775807 ? (
              <span className='text-orange-400'>{detail?.inscription?.id}</span>
            ) : (
              <span className='text-orange-400'>
                #{detail?.inscription?.number}
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
                {detail?.inscription?.id || '-'}
              </a>
            </div>

            <div className=''>
              <p className='text-gray-400'>Sat:</p>
              <p className='indent-2'>{detail?.inscription?.sat}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>Fee:</p>
              <p className='indent-2'>{detail?.inscription?.fee}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.deploy_time')}:</p>
              <p className='indent-2'>
                {new Date(detail?.inscription?.timestamp).toLocaleString('af')}
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