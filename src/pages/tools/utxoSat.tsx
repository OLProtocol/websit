import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast, Card, CardHeader, Heading, CardBody, Image, Box, Tooltip, Spacer } from '@chakra-ui/react';
import { getUtxoRanges } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useUnisatConnect } from '@/lib/hooks';
import { Flex, Input } from 'antd';
import { setSatIcon } from '@/lib/utils/sat';

const { Search } = Input;

export default function UtxoSat() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const toast = useToast();
  const [utxo, setUtxo] = useState('');
  const [satSize, setSatSize] = useState('');
  const [satList, setSatList] = useState<any[]>();
  const [rareSatList, setRareSatList] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const { network } = useUnisatConnect();

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      doSearch();
    }
  }
  
  const doSearch = async () => {
    setLoading(true);
    setSatList([]);
    const data = await getUtxoRanges({
      utxos: [utxo],
      excludeCommonRanges: false,
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
    let tmpSize: number = 0;
    let tmpSatList: any[] = [];
    if (data.data.ranges !== null && data.data.ranges.length > 0) {
      data.data.ranges.map((item) => {
        tmpSatList.push({
          start: item.start,
          end: item.end,
          size: item.size,
          type: item.satributes,
        })
        tmpSize += item.size;
      })
    }
    setSatList(tmpSatList);

    let tmpRareSatList: any[] = [];
    if (data.data.exoticRanges !== null && data.data.exoticRanges.length > 0) {
      data.data.exoticRanges.map((item) => {
        tmpRareSatList.push({
          start: item.start,
          end: item.end,
          size: item.size,
          type: item.satributes,
        })
        tmpSize += item.size;
      })
    }
    setRareSatList(tmpRareSatList);
    setSatSize('(total: ' + tmpSize + ')')
    setLoading(false);
  };

  return (
    <div>
      <div className='flex flex-col max-w-[56rem] mx-auto pt-8'>
        <div>
          <div className='flex justify-center mb-12 max-w-full mx-auto px-4'>
            <Search
              allowClear
              placeholder={t('pages.tools.utxo.search_placeholder')}
              size='large'
              value={utxo}
              onChange={(e) => setUtxo(e.target.value)}
              onSearch={doSearch}
            />
          </div>
          <div className='max-w-7xl mx-auto px-4'>
            <Card>
              <CardHeader>
                <Heading size='md'>
                  Sats{satSize}
                </Heading>
              </CardHeader>
              <CardBody>
              {((satList === undefined || satList.length === 0) && (rareSatList === undefined || rareSatList.length === 0)) && (
                <div className='max-w-max mx-auto p-2'>
                  <img src='/images/no_data.svg' className='w-10 h-10 ml-1'/>
                  <span className='text-gray-300'>No data</span>
                </div>
              )}
              {(satList !== undefined && satList.length > 0) && (
                satList.map((item: any) => (
                  <div className='max-w-max border border-teal-500 rounded-md mt-2'>
                  <Box as='button' borderRadius='md' bg='white' color='teal' px={4} h={8} m={2}>
                    {item.start+ '-' + item.end + '(' + item.size + ' sats)'}
                  </Box>
                  </div>
                ))
              )}
              {(rareSatList !== undefined && rareSatList.length > 0) && (
                rareSatList.map((item: any) => (
                  <div className='max-w-max flex border border-teal-500 rounded-md mt-2'>
                  <Box as='button' borderRadius='md' bg='white' color='teal' px={4} h={8} m={2}>
                  {item.start+ '-' + item.end + '  (' + item.size + ' sats)'}
                  </Box>
                  {item.type.map((t, _) => (
                    <Tooltip label={t}>
                      <Image src={setSatIcon(t)} className='w-6 h-6' mt={3}/>
                    </Tooltip>
                  ))}
                  </div>
                )) 
              )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
