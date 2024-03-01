import React, { useMemo, useState } from 'react';
import { SatItem } from './SatItem';
import { SatTable } from './SatTable';
interface SatRareBoxProps {
  sats: any[];
}
export const SatRareBox = ({ sats }: SatRareBoxProps) => {
  const [tabIndex, setTabIndex] = useState(-1);

  const tabList = useMemo(
    () => [
      {
        icon: '/images/sat/icon-uncommon.svg',
        name: 'Uncommon',
        className: 'text-[#ffd387] ml-2 text-lg',
        list: sats.filter((item) => item.types.includes('uncommon')),
      },
      {
        icon: '/images/sat/icon-rare.svg',
        name: 'Rare',
        className: 'text-[#8CFF82] ml-2 text-lg',
        list: sats.filter((item) => item.types.includes('rare')),
      },
      {
        icon: '/images/sat/icon-epic.svg',
        name: 'Epic',
        className: 'text-[#2FFFD6] ml-2 text-lg',
        list: sats.filter((item) => item.types.includes('epic')),
      },
      {
        icon: '/images/sat/icon-legendary.svg',
        name: 'Legendary',
        className: 'text-[#829BFF] ml-2 text-lg',
        list: sats.filter((item) => item.types.includes('legendary')),
      },
      {
        icon: '/images/sat/icon-mythic.svg',
        name: 'Mythic',
        className: 'text-[#C84EFF] ml-2 text-lg',
        list: sats.filter((item) => item.types.includes('mythic')),
      },
    ],
    [sats],
  );
  const showData = useMemo(() => tabList[tabIndex] || {}, [tabIndex, tabList]);
  return (
    <div className='rounded-2xl bg-gray-200 p-4'>
      <h3 className='text-2xl mb-2'>Rare Sats</h3>
      <div className='flex justify-between flex-wrap'>
        {tabList.map((item, index) => (
          <div
            key={index}
            onClick={() => setTabIndex(index)}
            className='flex items-center w-20 py-2 border-b-2 hover:border-red-400 cursor-pointer'>
            <img src={item.icon} alt='' className='w-6 h-6' />
            <span className={item.className}>x{item.list.length}</span>
          </div>
        ))}
      </div>
      {!!showData.list?.length && (
        <div className='p-2'>
          <div className='flex items-center'>
            <div className='p-1 bg-gray-200 rounded-full'>{showData.name}</div>
            <span>The first sat of each block</span>
          </div>
          <div>
            <SatTable sats={showData.list} />
          </div>
        </div>
      )}
    </div>
  );
};
