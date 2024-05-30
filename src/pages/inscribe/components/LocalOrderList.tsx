import { useMemo, useEffect } from 'react';
import { useOrderStore, OrderItemType } from '@/store';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { hideStr } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface LocalOrderListProps {
  onOrderClick?: (item: OrderItemType) => void;
}
interface DataType {
  orderId: string;
  status: string;
  created: number;
}
export const LocalOrderList = ({ onOrderClick }: LocalOrderListProps) => {
  const { t } = useTranslation();
  const { list, checkAllList } = useOrderStore((state) => state);
  const clickHandler = ({ orderId }) => {
    const item = list.find((v) => v.orderId === orderId);
    if (item) {
      onOrderClick?.(item);
    }
  };
  const columns: ColumnsType<DataType> = [
    {
      title: t('pages.inscribe.order.id'),
      dataIndex: 'orderId',
      key: 'orderId',
      render: (_, { orderId }) => {
        return hideStr(orderId, 10);
      },
    },
    {
      title: t('pages.inscribe.order.status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('pages.inscribe.order.created'),
      dataIndex: 'created',
      key: 'created',
      render: (_, { created }) => {
        return new Date(created).toLocaleString('af');
      },
    },
  ];

  const dataSource: DataType[] = useMemo(
    () =>
      list.map((item) => ({
        orderId: item.orderId,
        status: item.status,
        created: item.createAt,
      })),
    [list],
  );
  useEffect(() => {
    checkAllList();
  }, []);
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{
        position: ['bottomCenter'],
      }}
      onRow={(record) => {
        return {
          onClick: () => clickHandler(record), // 点击行
        };
      }}
    />
  );
};
