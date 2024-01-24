export * from './unisat';
export * from './useCalcFee';
import { add, format } from 'date-fns';
import { useMemo } from 'react';
interface BlockHeightTime {
  height: number;
  start: number;
  end: number;
}
export const useBlockHeightTime = ({ height, start, end }: BlockHeightTime) => {
  const time = useMemo(() => {
    console.log(height, start, end)
    try {
      const now = new Date();
      const startDis = start - height > 0 ? start - height : 0;
      const endDis = end - height > 0 ? end - height : 0;
      const startTime = add(now, { minutes: startDis * 10 });
      const endTime = add(now, { minutes: endDis * 10 });
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
