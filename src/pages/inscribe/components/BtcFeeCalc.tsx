import { Divider } from '@chakra-ui/react'
interface BtcFeeCalcProps {
  feeRate: number;
  onChange?: (value: number) => void;
}
export const BtcFeeCalc = ({feeRate}: BtcFeeCalcProps) => {
  return <div>
    <div className="flex justify-between items-center">
      <div className="mr-2 text-md font-bold text-gray-700">Sats In Inscription</div>
      <div className="text-sm">330 sats</div>
    </div>
    <Divider className='my-2'/>
    <div className="flex justify-between items-center">
      <div className="mr-2 text-md font-bold text-gray-700">Network Fee:</div>
      <div className="text-sm">~330 sats</div>
    </div>
    <div className="flex justify-between items-center">
      <div className="mr-2 text-md font-bold text-gray-700">Fee by Size:</div>
      <div className="text-sm">~330 sats</div>
    </div>
    <div className="flex justify-between items-center">
      <div className="mr-2 text-md font-bold text-gray-700">=</div>
      <div className="text-sm">~330 sats</div>
    </div>
    <Divider className='my-2'/>
    <div className="flex justify-between items-center">
      <div className="mr-2 text-md font-bold text-gray-700">Total</div>
      <div className="text-sm">~330 sats</div>
    </div>
  </div>
}