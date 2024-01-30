import { Alert } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/store';
import { useUnisatConnect } from '@/lib/hooks/unisat';

const MessageText = () => {
  const { t } = useTranslation();
  const { network } = useUnisatConnect();
  const { btcHeight } = useGlobalStore((state) => state);
  const href = useMemo(
    () =>
      `https://mempool.space/zh${
        network === 'testnet' ? '/testnet' : ''
      }/block/${btcHeight}`,
    [network, btcHeight],
  );
  return (
    <div className='flex items-center justify-center'>
      <div>{t('common.height_alert')}</div>
      <a className='text-blue-500 cursor-pointer ml-2' href={href} target='_blank'>
        {btcHeight}
      </a>
    </div>
  );
};

export const BtcHeightAlert = () => {
  return <Alert className='text-center' message={MessageText()} type='info' />;
};
