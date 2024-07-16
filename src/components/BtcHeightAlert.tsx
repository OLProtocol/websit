import { Alert } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { generateMempoolUrl } from '@/lib/utils';

const MessageText = () => {
  const { t } = useTranslation();
  const { network } = useReactWalletStore((state) => state);
  const { btcHeight } = useCommonStore((state) => state);
  const href = useMemo(
    () => generateMempoolUrl({ network, path: `block/${btcHeight}` }),
    [network, btcHeight],
  );
  return (
    <div className='flex items-center justify-center'>
      <div>{t('common.height_alert')}</div>
      <a
        className='text-blue-500 cursor-pointer ml-2'
        href={href}
        target='_blank'>
        {btcHeight}
      </a>
    </div>
  );
};

export const BtcHeightAlert = () => {
  return <Alert className='text-center' message={MessageText()} type='info' />;
};
