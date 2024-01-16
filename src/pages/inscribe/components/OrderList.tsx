import { useState } from 'react';
import { Card, Button } from 'antd';
import { OrderItemType } from '@/store';
import { LocalOrderList } from './LocalOrderList';
import { useOrderStore } from '@/store';
import { useTranslation } from 'react-i18next';

interface OrderListProps {
  onOrderClick?: (item: OrderItemType) => void;
}

export const OrderList = ({ onOrderClick }: OrderListProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('local');
  const { reset } = useOrderStore((state) => state);
  const orderTabList = [
    {
      key: 'local',
      tab: t('pages.inscribe.order.local'),
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
      title={t('pages.inscribe.order.name')}
      extra={
        <Button danger onClick={clearOrderList}>
          {t('buttons.clear_all')}
        </Button>
      }
      tabList={orderTabList}
      activeTabKey={activeTab}
      onTabChange={onTabChange}>
      <LocalOrderList onOrderClick={onOrderClick} />
    </Card>
  );
};
