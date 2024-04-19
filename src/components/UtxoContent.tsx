import { useInscriptiontInfo, useSeedByUtxo } from '@/api';
import { useEffect, useMemo } from 'react';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { Spin } from 'antd';

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
  const { data: seedData, trigger: seedTrigger } = useSeedByUtxo({
    network,
    utxo: utxo,
  });
  console.log(seedData);
  const seed = useMemo(() => seedData?.data?.[0]?.seed || 0, [seedData]);
  console.log(seed);
  const contentSrc = useMemo(() => {
    let url = '';
    if (detail?.delegate) {
      url = `https://${
        network === 'testnet' ? 'testnet.' : ''
      }ordinals.com/preview/${detail?.delegate}`;
    }
    if (url && seed !== null && seed !== undefined) {
      url = `${url}?seed=${seed}`;
    }
    return url;
  }, [network, detail?.delegate]);
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
    <Spin spinning={isLoading}>
      {contentSrc ? (
        <a
          href={contentSrc}
          target='_blank'
          rel='noopener noreferrer'
          className='block w-full h-full'>
          <iframe
            // sandbox='allow-scripts'
            src={contentSrc}
            className='max-w-full pointer-events-none max-h-full'></iframe>
        </a>
      ) : (
        '-'
      )}
    </Spin>
  );
}
