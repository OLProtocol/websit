export * from './mempool';
export * from './utxo';
import { getBlockStatus } from '@/api';
import { add, format } from 'date-fns';

export const getTimeByHeight = async (height: number, network: string) => {
  const key = `height-time-${height}`;
  const lcoalCache = localStorage.getItem(key);
  if (lcoalCache) {
    return +lcoalCache;
  }
  const { timestamp } = await getBlockStatus({ height, network });
  const time = timestamp * 1000;
  if (time) {
    localStorage.setItem(key, time.toString());
  }
  return time;
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
    if (start && start < height) {
      startTime = await getTimeByHeight(start, network);
      // console.log('startTime', startTime);
    } else {
      const startDis = start - height;
      startTime = add(now, { minutes: startDis * 10 });
    }

    if (end && end < height) {
      endTime = await getTimeByHeight(end, network);
    } else {
      const endDis = end - height;
      endTime = add(now, { minutes: endDis * 10 });
    }
    // console.log('startTime', startTime, 'endTime', endTime);
    return {
      start: format(new Date(startTime), 'yyyy-MM-dd HH:mm'),
      end: format(new Date(endTime), 'yyyy-MM-dd HH:mm'),
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
