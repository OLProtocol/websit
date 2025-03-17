import { useMemo, useState } from 'react';
import { SatTable } from './SatTable';
import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
interface SatRareBoxProps {
  sats: any[];
  canSplit: boolean;
}
export const SatRareBox = ({ sats, canSplit }: SatRareBoxProps) => {

  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);

  const tabList = useMemo(
    () => [
      {
        icon: './images/sat/icon-uncommon.svg',
        name: 'Uncommon',
        className: 'text-[#ac8258] ml-2 text-lg',
        list: sats.filter((item) => item.satributes.includes('uncommon')),
      },
      {
        icon: './images/sat/icon-rare.svg',
        name: 'Rare',
        className: 'text-[#598858] ml-2 text-lg',
        list: sats.filter((item) => item.satributes.includes('rare')),
      },
      {
        icon: './images/sat/icon-epic.svg',
        name: 'Epic',
        className: 'text-[#3c887c] ml-2 text-lg',
        list: sats.filter((item) => item.satributes.includes('epic')),
      },
      {
        icon: './images/sat/icon-legendary.svg',
        name: 'Legendary',
        className: 'text-[#829BFF] ml-2 text-lg',
        list: sats.filter((item) => item.satributes.includes('legendary')),
      },
      {
        icon: './images/sat/icon-mythic.svg',
        name: 'Mythic',
        className: 'text-[#C84EFF] ml-2 text-lg',
        list: sats.filter((item) => item.satributes.includes('mythic')),
      },
    ],
    [sats],
  );
  const showData = useMemo(() => tabList[tabIndex] || {}, [tabIndex, tabList]);
  return (
    <Card>
      <CardHeader>
        <Heading size='md'>
        {t('pages.rare_sat.card_header')}
        </Heading>
      </CardHeader>
      <CardBody>
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
            {/* <div className='flex items-center'>
              <div className='p-1 bg-gray-200 rounded-full'>{showData.name}</div>
              <span>The first sat of each block</span>
            </div>
            <div> */}
              <SatTable sats={showData.list} canSplit={canSplit} />
            {/* </div> */}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
