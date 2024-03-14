import { Tabs } from 'antd';
import { getSats } from '@/api';
import { useUnisatConnect } from '@/lib/hooks';
import { ItemList } from './components/ItemList';
import { UtxoList } from './components/UtxoList';
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Heading, useToast } from '@chakra-ui/react';
import { SatRareBox } from '../explorer/components/SatRareBox';
import { useTranslation } from 'react-i18next';
import { SatTypeBox } from '../explorer/components/SatTypeBox';
import { SatTable } from '../explorer/components/SatTable';
import { RareSat } from '../discover/rareSat';

export default function Account() {
  const { t } = useTranslation();
  const toast = useToast();
  const [rareSatList, setRareSatList] = useState<any[]>();
  const { network, currentAccount } = useUnisatConnect();
  // const { data, isLoading } = useCurUserRareSats({ currentAccount, network });

  const getRareSats = async () => {
    const data = await getSats({
      address: currentAccount,
      network,
    });
    if (data.code !== 0) {
      toast({
        title: data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const tmpSats: any[] | undefined = [];
    for (let i = 0; i < data?.data?.length; i++) {
      if (data.data[i].sats !== null && data.data[i].sats.length > 0) {
        tmpSats.push(...data.data[i].sats);
      }
    }
    tmpSats.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );
    setRareSatList(tmpSats);
  };
  useEffect(() => {
    getRareSats();
  }, []);
  return (
    <div className='max-w-6xl mx-auto p-2'>
      <Tabs
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
      />
    </div>
  );
}
