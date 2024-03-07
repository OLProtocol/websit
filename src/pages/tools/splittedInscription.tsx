// import { Input } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, InputGroup, InputRightElement, useToast, Card, CardHeader, Heading, CardBody } from '@chakra-ui/react';
import { getSplittedSats } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useUnisatConnect } from '@/lib/hooks';

export default function SplittedInscription() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const toast = useToast();
  const [ticker, setTicker] = useState('');
  const [inscriptionList, setInscriptionList] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const { network } = useUnisatConnect();

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      doSearch();
    }
  }
  
  const doSearch = async () => {
    setLoading(true);
    setInscriptionList([]);
    const data = await getSplittedSats({
      ticker: ticker,
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
    setInscriptionList(data.data);
    setLoading(false);
  };
  const toInscriptionInfo = (inscriptionNumber) => {
    nav(`/explorer/inscription/${inscriptionNumber}`);
  };
  return (
    <div>
      <div className='flex flex-col max-w-[48rem] mx-auto pt-8'>
        <div>
          <div className='flex justify-center mb-12 max-w-7xl mx-auto px-4'>
            <InputGroup size='lg' className='rounded-2xl'>
              <Input placeholder={t('pages.splitted_inscription.search_placeholder')} value={ticker} size='lg' onChange={(e) => setTicker(e.target.value)} onKeyDown={handleKeyDown} />
              <InputRightElement width='4.5rem' className='mr-1'>
                <Button isLoading={loading} size='md' onClick={doSearch} variant="solid" colorScheme='blue'>
                  Search
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
          <div className='max-w-7xl mx-auto px-4'>
            <Card>
              <CardHeader>
                <Heading size='md'>
                {t('pages.splitted_inscription.card_header')}
                </Heading>
              </CardHeader>
              <CardBody>
              {(inscriptionList !== undefined && inscriptionList.length > 0) ? (
                inscriptionList.map((item: any) => (
                  <Button size='sm' className='m-1' onClick={() => toInscriptionInfo(item)}>
                    #{item}
                  </Button>
                )) 
              ):(
                <div className='max-w-max mx-auto p-2'>
                  <img src='/images/no_data.svg' className='w-10 h-10 ml-1'/>
                  <span className='text-gray-300'>No data</span>
                </div>
              )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
