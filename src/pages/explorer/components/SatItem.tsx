import { Tag } from 'antd';
import { format } from 'date-fns';
import { CopyButton } from '@/components/CopyButton';
import { SplitSatButton } from './SplitSatButton';
import { useUnisatConnect } from '@/lib/hooks';
import { setSatIcon } from '@/lib/utils/sat';
interface SatItemProps {
  sat: any;
}
export const SatItem = ({ sat }: SatItemProps) => {
  const { network } = useUnisatConnect();
  console.log(network)
  console.log(network.includes('testnet'))

  return (
    <div className='group max-w-full mx-auto flex'>
      {/* <Tag color='gray'>{format(new Date(sat.time), 'yyyy-MM-dd')}</Tag> */}
      <Tag color='green' bordered={false}>
        Block#{sat.block}
      </Tag>
      
      {sat.size === 1 ? (
        <>
        <span className=''>{sat.start}</span>&nbsp;
        </>
      ) : (
        <>
          <span className=''>{sat.start}</span>
          <span className='mx-2'>-</span>
          <span className=''>{ sat.start + sat.size - 1}({sat.size} sats)</span>&nbsp;
        </>
      )}
      
      {sat.type.map((item, _) => (
        <img src={setSatIcon(item)} className='w-6 h-6 ml-1'/>
      ))}
      &nbsp;&nbsp;&nbsp;&nbsp;
      {/* {icon && <img src={icon} alt='' className='w-6 h-6 ml-4' />} */}
      <div className='flex'>
        <CopyButton text={sat.start} tooltip='Copy Sat' />&nbsp;&nbsp;
        {/* { (sat.canSplit || network.includes('testnet')) && ( */}
        {/* { (sat.canSplit) && (
        <SplitSatButton text={sat.start} tooltip='Split Sat' />
        )} */}
      </div>
    </div>
  );
};
