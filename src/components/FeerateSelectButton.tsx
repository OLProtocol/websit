import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useCommonStore } from '@/store';
import { BtcFeeRate } from './BtcFeeRate';
import { useBtcFeeRate } from '@/api';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
export const FeerateSelectButton = () => {
  const { network } = useReactWalletStore(state => state);
  const [fee, setFee] = useState(1);
  const { setFeeRate, feeRate } = useCommonStore((state) => state);
  const { data: feeRateData, error } = useBtcFeeRate(network as any);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setFeeRate({ value: fee, type: 'custom' });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const feeChange = (value: number) => {
    console.log('value', value);
    setFee(value);
  };
  useEffect(() => {
    if (feeRateData) {
      setFeeRate({ value: feeRateData?.halfHourFee || 1, type: 'Normal' });
    }
  }, [feeRateData]);
  return (
    <div>
      <Button type='dashed' size='small' ghost className='bg-transparent' onClick={() => setIsModalOpen(true)}>Gas: {feeRate.value}</Button>
      <Modal
        centered
        title='Gas Fee'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <BtcFeeRate onChange={feeChange} feeRateData={feeRateData} />
      </Modal>
    </div>
  );
};
