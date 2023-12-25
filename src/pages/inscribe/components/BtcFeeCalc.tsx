import { Divider } from '@chakra-ui/react'
interface BtcFeeCalcProps {
  feeRate: number;
  padding: number;
  networkFee: number;
  overheadFee: number;
  total: number;
  onChange?: (value: number) => void;
}
export const BtcFeeCalc = ({total, networkFee, padding, overheadFee}: BtcFeeCalcProps) => {
  return <div>
    <div className="flex justify-between items-center">
      <div className="mr-2 text-md font-bold text-gray-700">Sats In Inscription</div>
      <div className="text-sm">{padding} sats</div>
    </div>
    <Divider className='my-2'/>
    <div className="flex justify-between items-center">
      <div className="mr-2 text-md font-bold text-gray-700">Network Fee:</div>
      <div className="text-sm">~{networkFee} sats</div>
    </div>
    <div className="flex justify-between items-center">
      <div className="mr-2 text-md font-bold text-gray-700">overheadFee Fee:</div>
      <div className="text-sm">~{overheadFee} sats</div>
    </div>
    <Divider className='my-2'/>
    <div className="flex justify-between items-center">
      <div className="mr-2 text-md font-bold text-gray-700">Total</div>
      <div className="text-sm">~{total} sats</div>
    </div>
  </div>
}