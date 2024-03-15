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
