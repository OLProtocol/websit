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

export const useSatIcon = (type:  string) => {
  const icon = useMemo(() => {
    switch (type) {
      case 'rare':
        return '/images/sat/rare.svg';
      case 'common':
        return '/images/sat/common.svg';
      case 'uncommon':
        return '/images/sat/icon-uncommon.svg';
      case 'legendary':
        return '/images/sat/legendary.svg';
      case 'mythical':
        return '/images/sat/mythical.svg';
      case 'palindromes_integer':
        return '/images/sat/icon-dp.svg';
      case 'palindromes_name':
        return '/images/sat/icon-np.svg';
      case 'pizza':
        return '/images/sat/icon-pz.svg';
      default:
        return undefined;
    }
  }, [type]);
  return icon;
}