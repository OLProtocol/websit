import { Tag } from 'antd';
import { format } from 'date-fns';
// import { useSatIcon } from '@/lib/hooks';
import { CopyButton } from '@/components/CopyButton';
import { SplitSatButton } from './SplitSatButton';
import { useUnisatConnect } from '@/lib/hooks';
import { useLocation } from 'react-router-dom';
interface SatItemProps {
  sat: any;
}
export const SatItem = ({ sat }: SatItemProps) => {
  const { network } = useUnisatConnect();
  console.log(network)
  console.log(network.includes('testnet'))
  function setSatIcon (type:  string) : string {
    switch (type) {
      case 'rare':
        return '/images/sat/icon-rare.svg';
      case 'common':
        return '/images/sat/icon-default.svg';
      case 'uncommon':
        return '/images/sat/icon-uncommon.svg';
      case 'legendary':
        return '/images/sat/icon-legendary.svg';
      case 'mythical':
        return '/images/sat/icon-mythic.svg';
      case 'alpha':
        return '/images/sat/icon-al.svg';
      case 'black':
        return '/images/sat/icon-bl.svg';
      case 'block78':
        return '/images/sat/icon-78.svg';
      case 'block9':
        return '/images/sat/icon-9.svg';
      case 'hitman':
        return '/images/sat/icon-hm.svg';
      case 'jpeg':
        return '/images/sat/icon-jp.svg';
      case 'nakamoto':
        return '/images/sat/icon-nk.svg';
      case 'omega':
        return '/images/sat/icon-om.svg';
      case 'palindromes_paliblock':
        return '/images/sat/icon-pb.svg';
      case 'palindromes_integer':
        return '/images/sat/icon-dp.svg';
      case 'palindromes_integer_2d':
        return '/images/sat/icon-2dp.svg';
      case 'palindromes_integer_3d':
        return '/images/sat/icon-3dp.svg';
      case 'palindromes_name':
        return '/images/sat/icon-np.svg';
      case 'palindromes_name_2c':
        return '/images/sat/icon-2cp.svg';
      case 'palindromes_name_3c':
        return '/images/sat/icon-3cp.svg';
      case 'pizza':
        return '/images/sat/icon-pz.svg';
      case 'silk_road_first_auction':
        return '/images/sat/icon-sr.svg';
      case 'first_transaction':
        return '/images/sat/icon-t1.svg';
      case 'vintage':
        return '/images/sat/icon-vt.svg';
      default:
        return '/images/sat/icon-default.svg';
    }
  };

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
