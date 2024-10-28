import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { SatRareBox } from './components/SatRareBox';
import indexer from '@/api/indexer';
import { SatTable } from './components/SatTable';
import { SatTypeBox } from './components/SatTypeBox';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';

import { setCacheData, getCachedData } from '@/lib/utils/cache';
import { Input } from 'antd';
import { useNetwork } from '@/lib/wallet';
import { ExoticSatInfo, IndexerLayer, Sat } from '@/api/type';

const { Search } = Input;

interface RareSatProps {
  canSplit: boolean;
  targetAddress: string;
  indexerLayer?: IndexerLayer;
}

export const RareSat = ({ canSplit, targetAddress, indexerLayer = IndexerLayer.Base }: RareSatProps) => {
  const { t } = useTranslation();
  const [address, setAddress] = useState(targetAddress);
  const [allSatList, setAllSatList] = useState<any[]>();
  const [satList, setSatList] = useState<any[]>();
  const [satFilterList, setSatFilterList] = useState<any[]>();

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const network = useNetwork();
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  useEffect(() => {
    if (address === '') {
      setAddress(targetAddress);
    }
  }, [address, targetAddress]);

  useEffect(() => {
    if (satList) {
      const uniqueTypeSet = new Set<string>();
      satList.forEach((item) =>
        item.satributes.forEach((satType) => satType === 'first_transaction' ? uniqueTypeSet.add('1st TX') : uniqueTypeSet.add(satType)),
      );
      setUniqueTypes(Array.from(uniqueTypeSet));
      if (uniqueTypes.length > 0) {
        uniqueTypes.
          unshift('all');
      }
    }
  }, [satList]);

  function setFilterType(satType: string): void {
    if (satType === '1st TX') {
      satType = 'first_transaction';
    }
    if (satType === 'all') {
      setSatFilterList([]);
    } else {
      if (satList !== undefined) {
        setSatFilterList(satList.filter((item) => item.satributes.includes(satType)));
      }
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      doSearch();
    }
  }

  const doSearch = async () => {
    if (address === '') {
      return;
    }
    setLoading(true);
    setAllSatList([]);
    setSatList([]);
    const resp = await indexer.exotic.getExoticSatInfoList({ address: address }, indexerLayer);
    if (resp.code !== 0) {
      toast({
        title: resp.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    const tmpSats: Sat[] = [];
    const exoticSatInfoList = resp.data;
    for (let i = 0; i < exoticSatInfoList.length; i++) {
      const exoticSatInfo = exoticSatInfoList[i];
      if (exoticSatInfo.sats && exoticSatInfo.sats.length > 0) {
        exoticSatInfo.sats.forEach((item) => {
          // item.utxo = exoticSatInfo.utxo;
          // item.value = exoticSatInfo.value;
          tmpSats.push(item);
        })
      }
    }
    // tmpSats.sort(
    //   (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    // );
    setAllSatList(tmpSats);
    setCacheData('all_sat_list_' + address, tmpSats);

    tmpSats.forEach((item) => {
      if (item.satributes.length === 1) {
        const satType = item.satributes[0];
        if (satType !== 'uncommon'
          && satType !== 'rare'
          && satType !== 'epic'
          && satType !== 'legendary'
          && satType !== 'mythic') {
          return item;
        }
      } else {
        return item;
      }
    });
    // tmpSats = tmpSats
    //   .filter((item) => !item.satributes.includes('uncommon') && item.satributes.length > 1)
    //   .filter((item) => !item.satributes.includes('rare'))
    //   .filter((item) => !item.satributes.includes('epic'))
    //   .filter((item) => !item.satributes.includes('legendary'))
    //   .filter((item) => !item.satributes.includes('mythic'));
    setSatList(tmpSats);
    setLoading(false);
  };

  const countSats = (sats: any[], satType: string) => {
    let total = 0;
    if (satType === '1st TX') {
      satType = 'first_transaction';
    }
    sats.forEach((sat) => {
      if (satType === 'all') {
        total += sat.size;
      } else if (sat.satributes.includes(satType)) {
        total += sat.size;
      }
    });
    return total;
  };

  useEffect(() => {
    if (canSplit) {
      // setAddress(currentAccount);
      doSearch();
      // const cachedData = getCachedData('all_sat_list_' + address);
      // if (cachedData === null) {
      //   doSearch();
      // } else {
      //   setAllSatList(cachedData);
      // }

      // // 设置定时器每隔一定时间清除缓存数据
      // const intervalId = setInterval(() => {
      //   cacheData('all_sat_list_' + address, null);
      // }, 600000); // 每10min清除缓存数据
      // return () => clearInterval(intervalId); // 清除定时器
    }
  }, [canSplit, address]);
  return (
    <div className='flex flex-col max-w-7xl mx-auto pt-8'>
      <Card>
        <CardHeader className='text-center flex justify-between'>
          <Heading size='md' className='text-orange-500 font-bold'>
            {t('pages.rare_sat.des')}
          </Heading>
          {canSplit && (
            <Button
              bgColor={'white'}
              border='1px'
              borderColor='gray.400'
              size='sm'
              color='gray.600'
              onClick={doSearch}>
              {t('buttons.fresh')}
            </Button>
          )}
        </CardHeader>
        <CardBody>
          <div>
            {!canSplit && (
              <div className='flex justify-center mb-12 max-w-7xl mx-auto px-4'>
                <Search
                  allowClear
                  placeholder={t('pages.rare_sat.search_placeholder')}
                  size='large'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onSearch={doSearch}
                />
              </div>
            )}
            <div className='max-w-7xl mx-auto px-4 pb-4'>
              <SatTypeBox />
            </div>
            <div className='max-w-7xl mx-auto px-4'>
              {allSatList !== undefined && satList !== undefined ? (
                <div>
                  <SatRareBox sats={allSatList} canSplit={canSplit} />
                  <div className='pt-4' />
                  <Card>
                    <CardHeader>
                      <Heading size='md'>Interesting Sats</Heading>
                    </CardHeader>
                    <CardBody>
                      {uniqueTypes.map((item, index) => (
                        <Button
                          key={index}
                          size='sm'
                          className='m-1'
                          onClick={() => setFilterType(item)}>
                          {item}
                          {satList &&
                            satList.length > 0 &&
                            ' (' + countSats(satList, item) + ')'}
                        </Button>
                      ))}
                      {satFilterList && satFilterList.length > 0 ? (
                        <SatTable sats={satFilterList} canSplit={canSplit} />
                      ) : (
                        <SatTable sats={satList} canSplit={canSplit} />
                      )}
                    </CardBody>
                  </Card>
                </div>
              ) : (
                <div>
                  <SatRareBox sats={[]} canSplit={canSplit} />
                  <div className='pt-4' />
                  <Card>
                    <CardHeader>
                      <Heading size='md'>Interesting Sats</Heading>
                    </CardHeader>
                    <CardBody>

                    </CardBody>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
