import { Tag } from 'antd';
import { format } from 'date-fns';
import { useSatIcon } from '@/lib/hooks';
import { CopyButton } from '@/components/CopyButton';
interface SatItemProps {
  sat: any;
}
export const SatItem = ({ sat }: SatItemProps) => {
  const icon = useSatIcon(sat.types[0]);
  return (
    <div className='group'>
      <div className='flex mb-2'>
        <Tag color='gray'>{format(new Date(sat.time), 'yyyy-MM-dd')}</Tag>
        {/* <Tag color='gray'>{sat.time}</Tag> */}
        <Tag color='green' bordered={false}>
          Blk#{sat.block}
        </Tag>
      </div>
      <div className='flex items-center text-lg leading-none'>
        <span className=''>
          {sat.types?.[0] === 'palindromes_name' ? sat.name : sat.sat[0]}
        </span>
        {sat.sat[0] !== sat.sat[1] && (
          <>
            <span className='mx-2'>-</span>
            <span className=''>{sat.sat[1]}</span>
          </>
        )}
        {icon && <img src={icon} alt='' className='w-6 h-6 ml-4' />}
        <div className='ml-4 hidden group-hover:flex'>
          <CopyButton text={sat.sat[0]} tooltip='Copy Sat' />
        </div>
      </div>
    </div>
  );
};
