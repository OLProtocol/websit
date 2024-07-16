import React, { useMemo } from 'react';
import { Button } from 'antd';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useTranslation } from 'react-i18next';

interface BusButtonProps {
  children?: React.ReactNode;
}
export const BusButton = ({ children }: BusButtonProps) => {
  const { t } = useTranslation();
  const { connect, connected } =
    useReactWalletStore(state => state);
  const connectHanler = async () => {
    await connect();
  };

  return (
    <>
      {connected ? (
        <>{children}</>
      ) : (
        <div className='flex justify-center'>
          <Button
            size='large'
            type='primary'
            className='mx-auto'
            onClick={connectHanler}>
            {t('buttons.connect')}
          </Button>
        </div>
      )}
    </>
  );
};
