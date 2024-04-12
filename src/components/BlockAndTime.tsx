import { useUnisatConnect } from '@/lib/hooks/unisat';
import { fetchTipHeight, calcTimeBetweenBlocks } from '@/lib/utils';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { useCommonStore } from '@/store';
import { useEffect, useState } from 'react';

export const BlockAndTime = ({ startBlock, endBlock }: any) => {
  const { network } = useReactWalletStore((state) => state);
  const [time, setTime] = useState({ start: undefined, end: undefined } as any);
  const { btcHeight } = useCommonStore((state) => state);
  useEffect(() => {
    calcTimeBetweenBlocks({
      height: btcHeight,
      start: startBlock,
      end: endBlock,
      network,
    }).then((res) => {
      try {
        if (res.start && res.end) {
          setTime({
            start: res.start,
            end: res.end,
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
  }, [btcHeight, startBlock, endBlock, network]);
  return (
    <div className='flex flex-wrap gap-2 items-center justify-center'>
      <div className='flex justify-center'>
        {startBlock} - {endBlock}
      </div>
      <div className='text-xs text-gray-500 flex flex-wrap justify-center'>
        <div>{time.start}</div> <span className='mx-1'>~</span>
        <div>{time.end}</div>
      </div>
    </div>
  );
};
