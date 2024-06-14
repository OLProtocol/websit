export * from './mempool';
export * from './url';
export * from '../wallet/utxo';
export * from '../wallet/btc';
import { getHeightInfo } from '@/api';
import { add, format } from 'date-fns';
import { flat, sum } from 'radash';
import crypto from 'crypto';

export const getTimeByHeight = async (height: number, network: string) => {
  const key = `height-time-${height}`;
  const lcoalCache = sessionStorage.getItem(key);
  if (lcoalCache) {
    return +lcoalCache;
  }
  const { info } = await getHeightInfo({ height, network });
  const timestamp = info?.timestamp || 0;
  const time = timestamp * 1000;
  if (time) {
    sessionStorage.setItem(key, time.toString());
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
      const endDis = Math.ceil(end - height);
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
  num: number = 6,
  placeholder = '*****',
) => {
  let ret = '';
  if (typeof str === 'string' && str) {
    if (str?.length <= num) {
      ret = str;
    } else if (str.includes(':')) {
      const index = str.indexOf(':');
      ret = `${str?.substring(0, num)}${placeholder}${str?.substring(
        index - num,
      )}`;
    } else {
      ret = `${str?.substring(0, num)}${placeholder}${str?.substring(
        str?.length - num,
      )}`;
    }
  }
  return ret;
};
export const isRegExp = (str: string) => {
  try {
    new RegExp(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const generateSeed = (ranges) => {
  const jsonString = JSON.stringify(ranges);
  try {
    const bytes = new TextEncoder().encode(jsonString);
    const hash = crypto.createHash('sha256');
    hash.update(bytes);
    const hashResult = hash.digest('hex').slice(0, 16);
    return hashResult;
  } catch (error) {
    console.error('json.Marshal failed. ' + error);
    return '0';
  }
};
export const selectAmountRangesByUtxos = (utxos: any[], amount) => {
  const sats: any[] = flat(utxos.map((v) => v.sats));
  const ranges: any[] = [];
  let totalSize = 0;
  for (let i = 0; i < sats.length; i++) {
    const item = sats[i];
    const { size, start } = item;
    totalSize += size;

    if (totalSize > amount) {
      const dis = totalSize - amount;
      ranges.push({
        start,
        size: size - dis,
      });
    } else {
      ranges.push({
        start,
        size,
      });
    }
  }
  return ranges;
};
export const generateSeedByUtxos = (utxos: any[], amount) => {
  amount = Math.max(amount, 546);
  return generateSeed(selectAmountRangesByUtxos(utxos, amount));
};