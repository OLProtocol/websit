import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { SatRareBox } from '../explorer/components/SatRareBox';
import { getSats } from '@/api';
import { SatTable } from '../explorer/components/SatTable';
import { SatTypeBox } from '../explorer/components/SatTypeBox';
import { useUnisatConnect } from '@/lib/hooks';

interface RareSatProps {
  canSplit: boolean;
}

export const RareSat = ({ canSplit }: RareSatProps) => {
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [rareSatList, setRareSatList] = useState<any[]>();
  const [satList, setSatList] = useState<any[]>();
  const [satFilterList, setSatFilterList] = useState<any[]>();
  // const { network } = useUnisatConnect();
  const { network, currentAccount } = useUnisatConnect();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  let uniqueTypes: string[] = [];
  if (satList) {
    const uniqueTypeSet = new Set<string>();
    satList.forEach((item) =>
      item.type.forEach((satType) => satType === 'first_transaction' ? uniqueTypeSet.add('1st TX') :uniqueTypeSet.add(satType)),
    );
    uniqueTypes = Array.from(uniqueTypeSet);
    if (uniqueTypes.length > 0) {
      uniqueTypes.unshift('all');
    }
  }

  function setFilterType(satType: string): void {
    if (satType === 'all') {
      setSatFilterList([]);
    } else {
      if (satList !== undefined) {
        setSatFilterList(satList.filter((item) => item.type.includes(satType)));
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
    setRareSatList([]);
    setSatList([]);
    const data = await getSats({
      address: address,
      network,
    });
    if (data.code !== 0) {
      toast({
        title: data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    // setSats(data.data);
    let tmpSats: any[] = [];
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].sats !== null && data.data[i].sats.length > 0) {
        data.data[i].sats.forEach((item) => {
          item.id = data.data[i].id;
          tmpSats.push(item);
        })
        // tmpSats.push(...data.data[i].sats);
      }
    }
    tmpSats.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );
    setRareSatList(tmpSats);

    localStorage.setItem('address-4-search-rare-sats', address);
    
    tmpSats.forEach((item) => {
      if (item.type.length === 1) {
        const satType = item.type[0];
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
    })
    // tmpSats = tmpSats
    //   .filter((item) => !item.type.includes('uncommon') && item.type.length > 1)
    //   .filter((item) => !item.type.includes('rare'))
    //   .filter((item) => !item.type.includes('epic'))
    //   .filter((item) => !item.type.includes('legendary'))
    //   .filter((item) => !item.type.includes('mythic'));
    setSatList(tmpSats);
    setLoading(false);
  };

  // useEffect(() => {
  //   let tmpAddress = localStorage.getItem('address-4-search-rare-sats')
  //   if (tmpAddress != null && tmpAddress !== '') {
  //     setAddress(tmpAddress);
  //     doSearch();
  //   }
  // }, [address]);
  useEffect(() => {
    if (canSplit) {
      setAddress(currentAccount);
      doSearch();
    }
  }, [canSplit, address]);
  return (
    // <div className='flex flex-col max-w-[48rem] mx-auto pt-8'>
    <div className='flex flex-col max-w-7xl mx-auto pt-8'>
      <Card>
        <CardBody>
          <h1 className='text-lg font-bold text-orange-500 text-center mb-4'>
            {t('pages.rare_sat.des')}
          </h1>
          <div>
            {!canSplit && (
            <div className='flex justify-center mb-12 max-w-7xl mx-auto px-4'>
              <InputGroup  size='md'>
                <Input
                  fontSize={'md'}
                  pr='4.5rem'
                  placeholder={t('pages.rare_sat.search_placeholder')}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement width='4.5rem'>
                  <Button
                    isLoading={loading}
                    size={'md'}
                    onClick={doSearch}
                    variant='solid'
                    colorScheme='blue'>
                    Check
                  </Button>
                </InputRightElement>
              </InputGroup>
            </div>
            )}
            <div className='max-w-7xl mx-auto px-4 pb-4'>
              <SatTypeBox />
            </div>
            <div className='max-w-7xl mx-auto px-4'>
              {rareSatList !== undefined && satList !== undefined ? (
                <div>
                  <SatRareBox sats={rareSatList} canSplit={canSplit}/>
                  <div className='pt-4' />
                  <Card>
                    <CardHeader>
                      <Heading size='md'>Interesting Sats</Heading>
                    </CardHeader>
                    <CardBody>
                      {uniqueTypes.map((item, _) => (
                        <Button
                          size='sm'
                          className='m-1'
                          onClick={() => setFilterType(item)}>
                          {item}
                        </Button>
                      ))}
                      {satFilterList && satFilterList.length > 0 ? (
                        <SatTable sats={satFilterList} canSplit={canSplit}/>
                      ) : (
                        <SatTable sats={satList} canSplit={canSplit}/>
                      )}
                    </CardBody>
                  </Card>
                </div>
              ) : (
                <div>
                  <SatRareBox sats={[]} canSplit={canSplit}/>
                  <div className='pt-4' />
                  <Card>
                    <CardHeader>
                      <Heading size='md'>Interesting Sats</Heading>
                    </CardHeader>
                    <CardBody>
                      <SatTable sats={[]} canSplit={canSplit}/>
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
}
