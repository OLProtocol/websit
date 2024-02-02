export * from './mempool';
import { getBlockStatus } from '@/api';
import { add, format } from 'date-fns';

export const getTimeByHeight = async (height: number, network: string) => {
  const { data } = await getBlockStatus({ height, network });
  return data?.timestamp;
};

export const calcTimeBetweenBlocks = async ({
  height,
  start,
  end,
  network,
}: any) => {
  try {
    const now = +new Date();
    let startTime: any = now;
    let endTime: any = now;

    if (start < height) {
      startTime = await getTimeByHeight(start, network);
    } else {
      const startDis = start - height;
      startTime = add(now, { minutes: startDis * 10 });
    }

    if (end < height) {
      endTime = await getTimeByHeight(end, network);
    } else {
      const endDis = end - height > 0 ? end - height : 0;
    const endTime = add(now, { minutes: endDis * 10 });
    }
    
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
};
export const hideStr = (
  str?: string,
  num: number = 10,
  placeholder = '*****',
) => {
  if (typeof str === 'string' && str) {
    return `${str?.substring(0, num)}${placeholder}${str?.substring(
      str?.length - num,
    )}`;
  }
  return '';
};
export const isRegExp = (str: string) => {
  try {
    new RegExp(str);
    return true;
  } catch (e) {
    return false;
  }
};
