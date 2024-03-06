import { Tabs } from 'antd';
import { getMintInfo, getSats } from '@/api';
import { useUnisat, useUnisatConnect } from '@/lib/hooks';
import { ItemList } from './components/ItemList';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { SatRareBox } from '../explorer/components/SatRareBox';

export default function AccountIndex() {
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

    let tmpSats: any[] | undefined = [];
    for (let i = 0; i < data?.data?.length; i++) {
      if (data.data[i].sats !== null && data.data[i].sats.length > 0) {
        tmpSats.push(...data.data[i].sats);
      }
    }
    tmpSats.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );
    setRareSatList(tmpSats);
  }
  useEffect(() => {
    getRareSats();
  }, []);
  return (
    <div className='max-w-3xl mx-auto p-2'>
      <Tabs
        defaultActiveKey='1'
        size='large'
        items={[
          {
            label: 'My Items',
            key: '1',
            children: <ItemList />,
          },
          {
            label: 'Rare Sats',
            key: '2',
            children: rareSatList ? <SatRareBox sats={rareSatList} canSplit={true}/> : <SatRareBox sats={[]} canSplit={true}/>,
          },
        ]}
      />
    </div>
  );
}
