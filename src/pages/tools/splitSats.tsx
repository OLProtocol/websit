// import { Input } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, InputGroup, InputRightElement, useToast, Card, CardHeader, Heading, CardBody } from '@chakra-ui/react';
import { getSplittedSats } from '@/api';
import { useNavigate } from 'react-router-dom';

export default function SplitSats() {
  const [sat, setSat] = useState('');

  const { t } = useTranslation();
  const nav = useNavigate();
  const toast = useToast();
  const [ticker, setTicker] = useState('Pearl');
  const [inscriptionList, setInscriptionList] = useState<any[]>();
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    setLoading(true);
    setInscriptionList([]);
    const data = await getSplittedSats({
      ticker: ticker,
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
              <Input placeholder={t('pages.split_sat.search_placeholder')} value={ticker} size='lg' onChange={(e) => setTicker(e.target.value)} />
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
                  {t('pages.split_sat.card_header')}
                  </Heading>
                </CardHeader>
                <CardBody>
                {inscriptionList !== undefined ? 
                  inscriptionList.map((item: any) => (
                    <Button size='sm' className='m-1' onClick={() => toInscriptionInfo(item)}>
                        #{item}
                    </Button>
                  )) 
                  :
                  <span>No data</span>
                }
                </CardBody>
              </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
