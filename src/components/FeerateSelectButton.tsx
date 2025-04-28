import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useCommonStore } from '@/store';
import { BtcFeeRate } from './BtcFeeRate';
import { useBtcFeeRate } from '@/swr';
import { Icon } from '@iconify/react';

export const FeerateSelectButton = () => {
  const [fee, setFee] = useState(1);
  const { setFeeRate, feeRate } = useCommonStore((state) => state);
  const { data: resp } = useBtcFeeRate();
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
    if (resp) {
      setFeeRate({ value: resp?.halfHourFee || 1, type: 'Normal' });
    }
  }, [resp]);
  return (
    <div className='flex items-center justify-center'>

      <button
        className="flex justify-center items-center h-10 border border-zinc-600 rounded-lg px-3 text-zinc-200"
        onClick={() => setIsModalOpen(true)}
      >
        <Icon icon="mdi:gas-station" className="text-xl0" /> : {feeRate.value}
      </button>
      <Modal
        centered
        title='Gas Fee'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <BtcFeeRate onChange={feeChange} feeRateData={resp} />
      </Modal>
    </div>
  );
};
