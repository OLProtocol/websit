import { useParams } from 'react-router-dom';
import { useOrd2Info } from '@/api';
import { useEffect, useState, useMemo } from 'react';
import { Segmented } from 'antd';
import { InfoHolders } from './components/InfoHolders';
import { useBtcHeight } from '@/api';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { Button, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Ord2Info() {
  const { tick } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();
  const { network } = useUnisatConnect();
  const handleTabsChange = (i: number) => {
    if (i !== tabIndex) {
      setTabIndex(i);
    }
  };
  const { data: heightData } = useBtcHeight(network as any);
  const { data: detail, trigger, isLoading } = useOrd2Info({ tick });
  const status = useMemo(() => {
    return (detail?.startBlock &&
      detail?.endBlock &&
      heightData < detail.endBlock) ||
      detail.rarity !== 'unknow' ||
      detail.rarity !== 'common'
      ? 'Minting'
      : 'Completed';
  }, [detail, heightData]);
  const toInscribe = () => {
    console.log(detail);
    nav('/inscribe', {
      state: {
        type: 'ordx',
        item: {
          tick: detail.ticker,
          rarity: detail.rarity,
          limit: detail.limit,
        },
      },
    });
  };
  useEffect(() => {
    if (tick) {
      trigger();
    }
  }, [tick]);
  return (
    <Spin spinning={isLoading}>
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <span className='text-orange-400 text-2xl '>{tick}</span>
          <span>
            {status === 'Minting' ? (
              <Button type='link' onClick={() => toInscribe()}>
                {status}
              </Button>
            ) : (
              <Tag color='blue' key={status}>
                {status}
              </Tag>
            )}
          </span>
        </div>
        <div className='border-[1px] border-gray-200 rounded-xl mb-4'>
          <div className='border-b-[1px] border-gray-200 flex justify-between px-4 h-10 items-center'>
            <span> Overview</span>
          </div>
          <div className='p-4'>
            <div className='mb-2'>
              <p className='text-gray-400'>Description:</p>
              <p className='indent-2'>{detail?.description || '-'}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>Block:</p>
              <p className='indent-2'>{`${detail?.startBlock}-${detail?.endBlock}`}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>Deploy Height:</p>
              <p className='indent-2'>{detail?.deployHeight}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>Deploy Time:</p>
              <p className='indent-2'>
                {new Date(detail?.deployBlocktime).toLocaleString()}
              </p>
            </div>

            <div className='mb-2'>
              <p className='text-gray-400'>Minted:</p>
              <p className='indent-2'>{detail?.totalMinted}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>Limit per mint:</p>
              <p className='indent-2'>{detail?.limit}</p>
            </div>
            <div className=''>
              <p className='text-gray-400'>Rarity:</p>
              <p className='indent-2'>{detail?.rarity}</p>
            </div>
            <div className=''>
              <p className='text-gray-400'>Regular Expression:</p>
              <p className='indent-2'>{detail?.res || '-'}</p>
            </div>
            <div className=''>
              <p className='text-gray-400'>holders:</p>
              <p className='indent-2'>{detail?.holdersCount}</p>
            </div>
          </div>
        </div>
        <div className='border-[1px] border-gray-200 rounded-xl'>
          <div className='border-b-[1px] border-gray-200 flex justify-between px-4 h-14 items-center'>
            <Segmented
              options={['Holder', 'Transfers']}
              block
              className='w-52'
            />
          </div>
          <div className='p-4'>
            <InfoHolders />
          </div>
        </div>
      </div>
    </Spin>
  );
}
