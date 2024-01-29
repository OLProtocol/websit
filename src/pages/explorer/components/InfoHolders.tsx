import { useEffect, useMemo } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface DataType {
  rank: string;
  address: string;
  percentage: number;
  value: number;
}
export const InfoHolders = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {}, []);
  const columns: ColumnsType<DataType> = [
    {
      title: t('common.rank'),
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: t('common.address'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('common.percentage'),
      dataIndex: 'percentage',
      key: 'percentage',
    },
    {
      title: t('common.quantity'),
      dataIndex: 'value',
      key: 'value',
    },
  ];
  const dataSource: DataType[] = useMemo(
    () => [
      // {
      //   rank: '1',
      //   address: '0x123456789',
      //   percentage: 10,
      //   value: 100,
      // },
    ],
    [],
  );
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{
        position: ['bottomCenter'],
      }}
    />
  );
};
