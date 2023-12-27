import { IconButton } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { clacTextSize } from '../utils';
interface InscribeCheckItemProps {
  label: string | number;
  value: string;
  onRemove?: () => void;
}
export const InscribeRemoveItem = ({
  label,
  value,
  onRemove,
}: InscribeCheckItemProps) => {
  return (
    <div className='min-h-[3rem] flex rounded-xl overflow-hidden bg-gray-200 w-full'>
      <div className='flex justify-center items-center  w-14'>
        <div className='w-6 h-6 bg-gray-400 rounded-full flex justify-center items-center'>
          {label}
        </div>
      </div>
      <div className='flex flex-1 text-sm items-center py-2 break-all'>{value}</div>
      <div className='flex items-center pr-2'>
        <span className='mr-2'>{clacTextSize(value)} B</span>
        <IconButton
          onClick={onRemove}
          aria-label='remove item'
          className='bg-transparent'
          icon={<Icon icon='mdi:close-circle' className='text-lg' />}
        />
      </div>
      
    </div>
  );
};
