// import { Tabs } from 'antd';
import { getSats } from '@/api';
import { useUnisatConnect } from '@/lib/hooks';
import { ItemList } from './components/ItemList';
import { useEffect, useState } from 'react';
import { Card, CardBody, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RareSat } from '../discover/rareSat';

export default function Account() {
  const { t } = useTranslation();
  const toast = useToast();
  // const [rareSatList, setRareSatList] = useState<any[]>();
  const { network, currentAccount } = useUnisatConnect();
  // const { data, isLoading } = useCurUserRareSats({ currentAccount, network });

  // useEffect(() => {
  //   localStorage.setItem('address-4-search-rare-sats', currentAccount);
  //   setAddress(currentAccount)
  // }, [address]);

  return (
    <div className='max-w-6xl mx-auto p-2'>
    { currentAccount !== '' && (
      <Card>
        <CardBody>
          <Tabs>
            <TabList>
              <Tab>{t('pages.account.my_items')}</Tab>
              <Tab>{t('pages.account.rare_sats')}</Tab>
            </TabList>
            <TabPanels>
                <TabPanel><ItemList /></TabPanel>
                <TabPanel><RareSat canSplit={true}/></TabPanel>
              </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
      ) }
      {/* <Tabs
        defaultActiveKey='1'
        size='large'
        items={[
          {
            label: t('pages.account.my_items'),
            key: '1',
            children: <ItemList />,
          },
          {
            label: t('pages.account.rare_sats'),
            key: '2',
            children: <RareSat canSplit={true}/>,
          },
          // {
          //   label: '可花费Utxo',
          //   key: '3',
          //   children: <UtxoList address={currentAccount} />,
          // },
        ]}
      /> */}
    </div>
  );
}
