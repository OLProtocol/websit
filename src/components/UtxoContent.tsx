import { useInscriptiontInfo, useExoticUtxo } from '@/api';
import { useEffect, useMemo } from 'react';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { Spin } from 'antd';
import { generateOrdUrl } from '@/lib/utils';
import { generateSeedByUtxos } from '@/lib/utils';

interface UtxoContentProps {
  inscriptionId: string;
  utxo?: string;
}
export function UtxoContent({ inscriptionId, utxo }: UtxoContentProps) {
  const { network } = useReactWalletStore();
  const { data, trigger, isLoading } = useInscriptiontInfo({
    inscriptionId: inscriptionId,
    network,
  });
  const detail = useMemo(() => data?.data || {}, [data]);
  const { data: utxoData, trigger: seedTrigger } = useExoticUtxo({
    network,
    utxo: utxo,
  });
  console.log('utxoData', utxoData);
  const seed = useMemo(
    () =>
      utxoData?.data
        ? generateSeedByUtxos([utxoData?.data], utxoData?.data?.value)
        : 0,
    [utxoData],
  );
  const contentSrc = useMemo(() => {
    if (detail?.delegate && inscriptionId && seed) {
      return generateOrdUrl({
        network,
        path: `preview/${inscriptionId}?seed=${seed}`,
      });
    } else {
      return generateOrdUrl({
        network,
        path: `preview/${inscriptionId}`,
      });
    }
  }, [network, inscriptionId, seed, detail?.delegate]);
  useEffect(() => {
    if (inscriptionId) {
      trigger();
    }
  }, [inscriptionId, network]);
  useEffect(() => {
    if (utxo) {
      seedTrigger();
    }
  }, [utxo, network]);

  return (
    <div className='h-full'>
      {isLoading ? (
        <Spin spinning={isLoading}></Spin>
      ) : contentSrc ? (
        <a
          href={contentSrc}
          target='_blank'
          rel='noopener noreferrer'
          className='block w-full h-full'>
          <iframe
            src={contentSrc}
            className='max-w-full h-full pointer-events-none max-h-full'></iframe>
        </a>
      ) : (
        '-'
      )}
    </div>
  );
}
