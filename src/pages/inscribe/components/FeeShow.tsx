import { Divider } from 'antd';
interface FeeShowProps {
  inscriptionSize?: number;
  feeRate?: number;
  serviceFee?: number;
  totalFee?: number;
  networkFee?: number;
}
export const FeeShow = ({
  inscriptionSize,
  feeRate,
  serviceFee,
  totalFee,
  networkFee,
}: FeeShowProps) => {
  return (
    <div>
      {feeRate && (
        <>
          <div className='flex justify-between'>
            <div>Fee Rate</div>
            <div>
              <span>{feeRate}</span> <span> sate/vB</span>
            </div>
          </div>
          <Divider style={{ margin: '10px 0' }} />
        </>
      )}
      <div className='flex justify-between mb-2'>
        <div>Inscription Size</div>
        <div>
          <span>{inscriptionSize}</span> <span> sate</span>
        </div>
      </div>
      <div className='flex justify-between'>
        <div>Network Fee</div>
        <div>
          <span>{networkFee}</span> <span> sats</span>
        </div>
      </div>
      <Divider style={{ margin: '10px 0' }} />
      <div className='flex justify-between mb-2'>
        <div>
          Service Fee
          <span className='text-blue-400'>(1%, Minimum value 1000)</span>
        </div>
        <div>
          <span>{serviceFee}</span> <span> sats</span>
        </div>
      </div>
      <div className='flex justify-between'>
        <div>Total Fee</div>
        <div>
          <span>{totalFee}</span> <span> sats</span>
        </div>
      </div>
    </div>
  );
};
