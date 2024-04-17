import { useInscriptiontInfo, useSeedByUtxo } from '@/api';
import { useEffect, useMemo } from 'react';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { Spin } from 'antd';

interface UtxoContentProps {
  inscriptionId: string;
  utxo?: string;
}
export function UtxoContent({ inscriptionId, utxo }: UtxoContentProps) {
  console.log('UtxoContent', inscriptionId);
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
  const seed = useMemo(() => seedData?.data?.[0]?.seed || 0, [seedData]);
  const contentSrc = useMemo(() => {
    console.log(detail?.delegate, seed);
    if (detail?.delegate && seed !== null && seed !== undefined) {
      return `https://${
        network === 'testnet' ? 'testnet.' : ''
      }ordinals.com/preview/${detail?.delegate}?seed=${seed}`;
    } else {
      return;
    }
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
        <iframe
          scrolling='no'
          sandbox='allow-scripts'
          src={contentSrc}
          className='max-w-full'></iframe>
      ) : (
        '-'
        // <img src='/logo.jpg' alt='' />
      )}
    </Spin>
  );
}
