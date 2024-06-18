import { useInscriptiontInfo, useExoticUtxo } from '@/api';
import { useEffect, useMemo } from 'react';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { Spin } from 'antd';
import { generateOrdUrl } from '@/lib/utils';
import { generateSeed  } from '@/lib/utils';

interface UtxoContentProps {
  inscriptionId: string;
  ranges?: any[];
}
export function UtxoContent({ inscriptionId, ranges = [] }: UtxoContentProps) {
  const { network } = useReactWalletStore();
  const { data, trigger, isLoading } = useInscriptiontInfo({
    inscriptionId: inscriptionId,
    network,
  });
  const detail = useMemo(() => data?.data || {}, [data]);
  const seed = useMemo(
    () =>
      ranges.length > 0
        ? generateSeed(ranges)
        : 0,
    [ranges],
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
