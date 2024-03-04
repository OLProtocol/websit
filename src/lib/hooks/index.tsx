export * from './unisat';
export * from '../utils/useCalcFee';
import { useState, useEffect } from 'react';
import { add, format } from 'date-fns';
import { useMemo } from 'react';
import { calcTimeBetweenBlocks } from '@/lib/utils';
interface BlockHeightTime {
  height: number;
  start: number;
  end: number;
  network: string;
}
// export const useBlockHeightTime = ({ height, start, end, network }: BlockHeightTime) => {

//   const [startTime, setStartTime] = useState<any>();
//   const [endTime, setEndTime] = useState<any>();
//   useEffect(() => {
//     calcTimeBetweenBlocks({ height, start, end, network }).then((res) => {
//       setStartTime(res.start);
//       setEndTime(res.end);
//     });
//   }, [height, start, end, network]);
//   return {
//     start: startTime,
//     end: endTime,
//   };
// };

// export const useSatIcon = (type:  string) => {
//   const icon = useMemo(() => {
//     switch (type) {
//       case 'rare':
//         return '/images/sat/icon-rare.svg';
//       case 'common':
//         return '/images/sat/common.svg';
//       case 'uncommon':
//         return '/images/sat/icon-uncommon.svg';
//       case 'legendary':
//         return '/images/sat/icon-legendary.svg';
//       case 'mythical':
//         return '/images/sat/icon-mythical.svg';
//       case 'alpha':
//         return '/images/sat/icon-al.svg';
//       case 'black':
//         return '/images/sat/icon-bl.svg';
//       case 'block78':
//         return '/images/sat/icon-78.svg';
//       case 'block9':
//         return '/images/sat/icon-9.svg';
//       case 'hitman':
//         return '/images/sat/icon-hm.svg';
//       case 'jpeg':
//         return '/images/sat/icon-jp.svg';
//       case 'nakamoto':
//         return '/images/sat/icon-nk.svg';
//       case 'omega':
//         return '/images/sat/icon-om.svg';
//       case 'palindromes_paliblock':
//         return '/images/sat/icon-pb.svg';
//       case 'palindromes_integer':
//         return '/images/sat/icon-dp.svg';
//       case 'palindromes_integer_2d':
//         return '/images/sat/icon-2dp.svg';
//       case 'palindromes_integer_3d':
//         return '/images/sat/icon-3dp.svg';
//       case 'palindromes_name':
//         return '/images/sat/icon-np.svg';
//       case 'palindromes_name_2c':
//         return '/images/sat/icon-2cp.svg';
//       case 'palindromes_name_3c':
//         return '/images/sat/icon-3cp.svg';
//       case 'pizza':
//         return '/images/sat/icon-pz.svg';
//       case 'silk_road_first_auction':
//         return '/images/sat/icon-sr.svg';
//       case 'first_transaction':
//         return '/images/sat/icon-t1.svg';
//       case 'vintage':
//         return '/images/sat/icon-vt.svg';
//       default:
//         return '/images/logo.jpg';
//     }
//   }, [type]);
//   return icon;
// }