import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, useToast, Card, CardHeader, CardBody, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { getSplittedSats } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { Input } from 'antd';

const { Search } = Input;

export default function SplittedInscription() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const toast = useToast();
  const [ticker, setTicker] = useState('');
  const [inscriptionList, setInscriptionList] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const { network } = useReactWalletStore();

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
  const toInscriptionInfo = (inscriptionId) => {
    nav(`/explorer/inscription/${inscriptionId}`);
  };
  return (
    <div className='flex flex-col max-w-[48rem] mx-auto pt-8'>
      <Card>
        <CardHeader>
          <Search
            allowClear
            placeholder={t('pages.tools.splitted_inscription.search_placeholder')} 
            size='large'
            value={ticker}
            onChange={(e) => setTicker(e.target.value)} onKeyDown={handleKeyDown}
            onSearch={doSearch}
          />
        </CardHeader>
        <CardBody pt={0}>
          <Tabs>
            <TabList>
              <Tab>{t('pages.tools.splitted_inscription.card_header')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
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
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
