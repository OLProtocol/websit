import { useEffect, useMemo } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useOrd2Status } from '@/api';
import { useNavigate } from 'react-router-dom';
interface DataType {
  rank: string;
  address: string;
  percentage: number;
  value: number;
}
export const InfoHolders = () => {
  const nav = useNavigate();
  useEffect(() => {}, []);
  const columns: ColumnsType<DataType> = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];
  const dataSource: DataType[] = useMemo(
    () => [
      {
        rank: '1',
        address: '0x123456789',
        percentage: 10,
        value: 100,
      },
    ],
    [],
  );
  return <Table columns={columns} dataSource={dataSource} />;
};
