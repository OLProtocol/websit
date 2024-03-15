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
    // <div className='group max-w-full mx-auto'>
      <div className='group max-w-full mx-auto flex'>
        <Tag color='gray'>{format(new Date(sat.time), 'yyyy-MM-dd')}</Tag>
        {/* <Tag color='gray'>{sat.time}</Tag> */}
        <Tag color='green' bordered={false}>
          Block#{sat.block}
        </Tag>
        
      {/* </div>
      <div className='flex items-center text-lg leading-none'> */}
        <span className=''>
          {sat.type?.[0] === 'palindromes_name' ? sat.name : sat.sat[0]}
        </span>
        {sat.sat[0] !== sat.sat[1] && (
          <>
            <span className='mx-2'>-</span>
            <span className=''>{sat.sat[1]}</span>&nbsp;
          </>
        )}
        
        {sat.type.map((item, _) => (
          <img src={setSatIcon(item)} className='w-6 h-6 ml-1'/>
        ))}
        &nbsp;&nbsp;&nbsp;&nbsp;
        {/* {icon && <img src={icon} alt='' className='w-6 h-6 ml-4' />} */}
        <div className='flex'>
          <CopyButton text={sat.sat[0]} tooltip='Copy Sat' />&nbsp;&nbsp;
          { (sat.canSplit || network.includes('testnet')) &&
          <SplitSatButton text={sat.sat[0]} tooltip='Split Sat' />
          }
        </div>
      </div>
    // </div>
  );
};
