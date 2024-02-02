export * from './unisat';
export * from '../utils/useCalcFee';
import { add, format } from 'date-fns';
import { useMemo } from 'react';
import { calcTimeBetweenBlocks } from '@/lib/utils';
interface BlockHeightTime {
  height: number;
  start: number;
  end: number;
}
export const useBlockHeightTime = ({ height, start, end }: BlockHeightTime) => {
  const time = useMemo(() => {
    try {
      const now = new Date();
      const startDis = start - height > 0 ? start - height : 0;
      const endDis = end - height > 0 ? end - height : 0;
      const startTime = add(now, { minutes: startDis * 9 });
      const endTime = add(now, { minutes: endDis * 9 });
      return {
        start: format(startTime, 'yyyy-MM-dd HH:mm'),
        end: format(endTime, 'yyyy-MM-dd HH:mm'),
      };
    } catch (error) {
      console.log(error);
      return {
        start: undefined,
        end: undefined,
      };
    }
  }, [height, start, end]);
  return time;
};

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