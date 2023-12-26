import { hideStr } from '@/lib/utils';
interface InscribeCheckItemProps {
  
  label: string | number;
  value: string;
  address: string;
  status: any;
}
export const InscribeOrderItem = ({ label, value, status, address }: InscribeCheckItemProps) => {
  return (
    <div className='min-h-[4rem] flex rounded-xl overflow-hidden bg-gray-200 w-full'>
      <div className='flex justify-center items-center bg-gray-300 w-20'>
        <div className='w-6 h-6 bg-gray-400 rounded-full flex justify-center items-center'>
          {label}
        </div>
      </div>
      <div className='flex flex-1 items-center px-4 py-2  justify-between'>
        <div>
          <div>{value}</div>
          <div>{hideStr(address, 10)}</div>
        </div>
        <span>{status}</span>
      </div>
    </div>
  );
};
