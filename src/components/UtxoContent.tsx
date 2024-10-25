import { useInscriptiontInfo } from '@/swr';
import { useEffect, useMemo } from 'react';
import { Spin } from 'antd';
import { genOrdServiceUrl } from '@/lib/utils';
import { generateSeed } from '@/lib/utils';
import { useNetwork } from '@/lib/wallet';

interface UtxoContentProps {
  inscriptionId: string;
  ranges?: any[];
}
export function UtxoContent({ inscriptionId, ranges = [] }: UtxoContentProps) {
  const network = useNetwork();
  const { resp, trigger, isLoading } = useInscriptiontInfo({
    inscriptionId: inscriptionId,
  });
  const detail = useMemo(() => resp?.data , [resp]);
  // console.log('UtxoContent ranges:', ranges, inscriptionId);
  const seed = useMemo(
    () => {
      // console.log("utxoContent ranges:" + JSON.stringify(ranges));
      return ranges.length > 0
        ? generateSeed(ranges)
        : 0
    },
    [ranges],
  );
  const contentSrc = useMemo(() => {
    // console.log("utxoContent delegate:", detail?.delegate, "inscriptionid:", inscriptionId, "seed:", seed);
    if (detail?.delegate && inscriptionId && seed) {
      return genOrdServiceUrl({
        network,
        path: `preview/${inscriptionId}?seed=${seed}`,
      });
    } else {
      return genOrdServiceUrl({
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
