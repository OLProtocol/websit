import { useInscriptiontInfo, useExoticUtxo } from '@/api';
import { useEffect, useMemo } from 'react';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { Spin } from 'antd';
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
  console.log(seed);
  const contentSrc = useMemo(() => {
    if (detail?.delegate && inscriptionId && seed) {
      return `https://ord-${
        network === 'testnet' ? 'testnet' : 'mainnet'
      }.ordx.space/preview/${inscriptionId}?seed=${seed}`;
    } else {
      return;
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
    <Spin spinning={isLoading}>
      {contentSrc ? (
        <a
          href={contentSrc}
          target='_blank'
          rel='noopener noreferrer'
          className='block w-full h-full'>
          <iframe
            src={contentSrc}
            className='max-w-full pointer-events-none max-h-full'></iframe>
        </a>
      ) : (
        '-'
      )}
    </Spin>
  );
}
