import React, { useMemo, useState } from 'react';
import { SatTable } from './SatTable';
interface SatInterstingBoxProps {
  sats: any[];
}
export const SatInterstingBox = ({ sats }: SatInterstingBoxProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const list = useMemo(() => {
    if (filterType === 'all') {
      return sats;
    }
    return sats.filter((item) => item.types.includes(filterType));
  }, [sats, filterType]);
  return (
    <div className='rounded-2xl bg-gray-200 p-4 sat-box'>
      <h3 className='text-2xl mb-2 bg-transparent'>Intersting Sats</h3>
      <div>
        <SatTable sats={list} canSplit={false} />
      </div>
    </div>
  );
};
