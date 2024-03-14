import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useCommonStore } from '@/store';
import { BtcFeeRate } from './BtcFeeRate';
export const FeerateSelectButton = () => {
  const [fee, setFee] = useState(1);
  const { setFeeRate, feeRate } = useCommonStore((state) => state);
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
  return (
    <div>
      <Button type='dashed' size='small' ghost className='bg-transparent' onClick={() => setIsModalOpen(true)}>Gas: {feeRate.value}</Button>
      <Modal
        centered
        title='Gas Fee'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <BtcFeeRate onChange={feeChange} />
      </Modal>
    </div>
  );
};
