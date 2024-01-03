import { useMemo } from 'react';
import { useOrderStore, OrderItemType } from '@/store';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { hideStr } from '@/lib/utils';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { inscribe } from '../utils';
import { render } from 'react-dom';

interface LocalOrderListProps {
  onOrderClick?: (item: OrderItemType) => void;
}
interface DataType {
  orderId: string;
  status: string;
  created: number;
}
export const LocalOrderList = ({ onOrderClick }: LocalOrderListProps) => {
  const { list } = useOrderStore((state) => state);
  const clickHandler = ({ orderId }) => {
    const item = list.find((v) => v.orderId === orderId);
    if (item) {
      onOrderClick?.(item);
    }
  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (_, { orderId }) => {
        return hideStr(orderId, 10);
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Create Date',
      dataIndex: 'created',
      key: 'created',
      render: (_, { created }) => {
        return new Date(created).toLocaleString();
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
