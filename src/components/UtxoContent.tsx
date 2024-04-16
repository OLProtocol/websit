import { useInscriptiontInfo } from '@/api';
import { useEffect, useMemo } from 'react';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { Spin } from 'antd';

interface UtxoContentProps {
  inscriptionId: string;
}
export function UtxoContent({ inscriptionId }: UtxoContentProps) {
  const { network } = useReactWalletStore();
  const { data, trigger, isLoading } = useInscriptiontInfo({
    inscriptionId: inscriptionId,
    network,
  });
  const detail = useMemo(() => data?.data || {}, [data]);

  useEffect(() => {
    if (inscriptionId) {
      trigger();
    }
  }, [inscriptionId, network]);

  return (
    <Spin spinning={isLoading}>
      {detail?.delegate ? (
        <iframe
          scrolling='no'
          sandbox='allow-scripts'
          src={`https://${
            network === 'testnet' ? 'testnet.' : ''
          }ordinals.com/preview/${detail?.delegate}`}
          className='max-w-full'></iframe>
      ) : (
        <img src='/logo.jpg' alt='' />
      )}
    </Spin>
  );
}
