import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast, Card, CardHeader, Heading, CardBody, TabList, Tab, Tabs, TabPanels, TabPanel, Divider, Box, Tooltip, Image, InputGroup, InputRightElement, IconButton, CardFooter, Button } from '@chakra-ui/react';
import { getAssetByUtxo, getSatsByUtxo } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { UtxoAssetTable } from './components/UtxoAssetTable';
import { setSatIcon } from '@/lib/utils/sat';
import { Input } from 'antd';

const { Search } = Input;

export default function Utxo() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const toast = useToast();
  const [utxo, setUtxo] = useState('');
  const [assetList, setAssetList] = useState<any[]>();
  const [satSize, setSatSize] = useState('');
  const [rareSatSize, setRareSatSize] = useState('');
  const [satList, setSatList] = useState<any[]>();
  const [rareSatList, setRareSatList] = useState<any[]>();

  const [loading, setLoading] = useState(false);
  const { network } = useReactWalletStore();

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      doSearch();
    }
  }

  const doSearch = async () => {
    if (utxo === '') {
      toast({
        title: 'Please input utxo',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return
    }
    getAssets()
    getSats()
  }

  const getSats = async () => {
    setLoading(true);
    setSatList([]);
    const data = await getSatsByUtxo({
      utxo: utxo,
      network,
    });

    if (data.code !== 0) {
      setLoading(false);
      toast({
        title: data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (data.data === null || data.data.length === 0) {
      setLoading(false);
      toast({
        title: 'No data',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return
    }
    let tmpSatSize: number = 0;
    let tmpSatList: any[] = [];
    let tmpRareSatSize = 0
    let tmpRareSatList: any[] = [];
    if (data.data !== null && data.data.length > 0) {
      data.data.map((item) => {
        const sat = {
          start: item.start,
          end: item.start + item.size - 1,
          size: item.size,
          satributes: item.satributes,
        }
        if (item.satributes && item.satributes.length > 0) {
          tmpRareSatList.push(sat)
          tmpRareSatSize += sat.size;
        }
        tmpSatList.push(sat)
          tmpSatSize += sat.size;
      })
    }
    setSatList(tmpSatList);
    setSatSize('(total: ' + tmpSatSize + ')')

    // if (data.data.exoticRanges !== null && data.data.exoticRanges.length > 0) {
    //   data.data.exoticRanges.map((item) => {
    //     tmpRareSatList.push({
    //       start: item.start,
    //       end: item.end,
    //       size: item.size,
    //       satributes: item.satributes,
    //     })
    //     tmpSize += item.size;
    //   })
    // }
    setRareSatList(tmpRareSatList);
    setRareSatSize('(total: ' + tmpRareSatSize + ')')

    setLoading(false);
  };

  const getAssets = async () => {
    setLoading(true);
    setAssetList([]);
    const data = await getAssetByUtxo({
      utxo: utxo,
      network,
    });

    if (data.code !== 0) {
      setLoading(false);
      toast({
        title: data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (data.data === null) {
      setLoading(false);
      toast({
        title: 'No data',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return
    }
    setAssetList(data.data);
    setLoading(false);
  };
  // const toInscriptionInfo = (inscriptionNumber) => {
  //   nav(`/explorer/inscription/${inscriptionNumber}`);
  // };
  const splitHandler = async () => {
    toast({
      title: 'Coming soon!',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <div className='flex flex-col max-w-[56rem] mx-auto pt-8'>
      <Card>
        <CardHeader>
          <Search
            allowClear
            placeholder={t('pages.tools.utxo.search_placeholder')}
            size='large'
            value={utxo}
            onChange={(e) => setUtxo(e.target.value)} onKeyDown={handleKeyDown}
            onSearch={doSearch}
          />
        </CardHeader>
        <CardBody pt={0}>
          <Tabs colorScheme='teal' isFitted>
            <TabList>
              <Tab _selected={{ color: 'white', bg: 'teal.500' }}>{t('pages.tools.utxo.card_header_asset')}</Tab>
              <Tab _selected={{ color: 'white', bg: 'teal.500' }}>{t('pages.tools.utxo.card_header_sat')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Card>
                  <CardBody>
                    {(assetList !== undefined && assetList.length > 0) ? (
                      <UtxoAssetTable assets={assetList} />
                    ) : (
                      <div className='max-w-max mx-auto p-2'>
                        <Image src='/images/no_data.svg' className='w-10 h-10 ml-1' />
                        <span className='text-gray-300'>No data</span>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>
              <TabPanel>
                <Card>
                  <CardHeader>
                    <Heading size='md'>
                      Rare Sats{rareSatSize}
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    {((rareSatList === undefined || rareSatList.length === 0)) && (
                      <div className='max-w-max mx-auto p-2'>
                        <Image src='/images/no_data.svg' className='w-10 h-10 ml-1' />
                        <span className='text-gray-300'>No data</span>
                      </div>
                    )}
                    {(rareSatList !== undefined && rareSatList.length > 0) && (
                      rareSatList.map((item: any) => (
                        <div className='max-w-max flex border border-teal-500 rounded-md mt-2'>
                          <Box as='text' borderRadius='md' bg='white' color='teal' px={4} h={8} mt={2}>
                            {item.size > 1 ? item.start + '-' + item.end + '(' + item.size + ' sats)' : item.start}
                          </Box>
                          {item.satributes.map((t, _) => (
                            <Tooltip label={t}>
                              <Image src={setSatIcon(t)} className='w-6 h-6' mt={2} mr={2} />
                            </Tooltip>
                          ))}
                        </div>
                      ))
                    )}
                  </CardBody>
                </Card>
                <Divider mt={4} mb={4} />
                <Card>
                  <CardHeader>
                    <Heading size='md'>
                      Sats{satSize}
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    {((satList === undefined || satList.length === 0)) && (
                      <div className='max-w-max mx-auto p-2'>
                        <Image src='/images/no_data.svg' className='w-10 h-10 ml-1' />
                        <span className='text-gray-300'>No data</span>
                      </div>
                    )}
                    {(satList !== undefined && satList.length > 0) && (
                      satList.map((item: any) => (
                        <div className='max-w-max border border-teal-500 rounded-md mt-2'>
                          <Box as='text' borderRadius='md' bg='white' color='teal' px={4} h={8} mt={2}>
                            {item.start + '-' + item.end + '(' + item.size + ' sats)'}
                          </Box>
                        </div>
                      ))
                    )}
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
        <Divider borderColor={'teal.500'} />
        <CardFooter>
          <Button variant='solid' colorScheme='teal' onClick={splitHandler} isLoading={loading}>Split</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
