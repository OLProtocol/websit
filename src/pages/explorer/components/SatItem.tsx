import { Tag } from 'antd';
import { format } from 'date-fns';

interface SatItemProps {
  sat: any;
}
export const SatItem = ({ sat}: SatItemProps) => {
  return (
    <div className='py-1'>
      <div className='flex'>
        <Tag color='gray'>{format(new Date(sat.time), 'yyyy-MM-dd')}</Tag>
        {/* <Tag color='gray'>{sat.time}</Tag> */}
        <Tag color='green'>Blk#{sat.block}</Tag>
      </div>
      <div className='flex items-center text-lg leading-none'>
        <span className=''>{sat.sat[0]}</span>
        {sat.sat[0] !== sat.sat[1] && (
          <>
            <span className='mx-2'>-</span>
            <span className=''>{sat.sat[1]}</span>
          </>
        )}
        {/* <img src={icon} alt='' className='w-6 h-6 mx-4' /> */}
      </div>
    </div>
  );
};
