import { Tabs } from 'antd';
import { getMintInfo } from '@/api';
import { useUnisat } from '@/lib/hooks';
import { ItemList } from './components/ItemList';

export default function InscribeCheck() {
  const { network, address } = useUnisat();
  return (
    <div className='max-w-lg mx-auto p-2'>
      <Tabs
        defaultActiveKey='1'
        size='large'
        items={[
          {
            label: 'My Items',
            key: '1',
            // children: () => <ItemList />,
          },
          {
            label: 'Rare Sats',
            key: '2',
            children: 'No rare sats found.',
          },
        ]}
      />
    </div>
  );
}
