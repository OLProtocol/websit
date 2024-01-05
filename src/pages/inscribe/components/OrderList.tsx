import { useState } from 'react';
import { Card, Button } from 'antd';
import { OrderItemType } from '@/store';
import { LocalOrderList } from './LocalOrderList';
import { useOrderStore } from '@/store';

interface OrderListProps {
  onOrderClick?: (item: OrderItemType) => void;
}

export const OrderList = ({ onOrderClick }: OrderListProps) => {
  const [activeTab, setActiveTab] = useState<string>('local');
  const { reset } = useOrderStore((state) => state);
  const orderTabList = [
    {
      key: 'local',
      tab: 'Local Order',
    },
  ];
  const onTabChange = (key: string) => {
    setActiveTab(key);
  };
  const clearOrderList = () => {
    reset();
  };
  return (
    <Card
      style={{ width: '100%' }}
      title='Order List'
      extra={
        <Button danger onClick={clearOrderList}>
          Clear All
        </Button>
      }
      tabList={orderTabList}
      activeTabKey={activeTab}
      onTabChange={onTabChange}>
      <LocalOrderList onOrderClick={onOrderClick} />
    </Card>
  );
};
