import { useEffect, useMemo } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useOrdxTickHolders } from '@/api';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { useTranslation } from 'react-i18next';
import { hideStr } from '@/lib/utils';

interface DataType {
  rank: string;
  address: string;
  percentage: number;
  value: number;
}
interface InfoHoldersProps {
  tick: string;
}
export const InfoHolders = ({ tick }: InfoHoldersProps) => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { network } = useUnisatConnect();
  const { data, isLoading, trigger } = useOrdxTickHolders({
    tick,
    network,
  });
  const list = useMemo(() => data?.data?.detail || [], [data]);
  useEffect(() => {
    trigger();
  }, [network, tick]);
  const columns: ColumnsType<DataType> = [
    // {
    //   title: t('common.rank'),
    //   dataIndex: 'rank',
    //   key: 'rank',
    // },
    {
      title: t('common.address'),
      dataIndex: 'address',
      align: 'center',
      key: 'address',
      render: (t) => (
        <span
          className='text-blue-500 cursor-pointer'
          onClick={() => {
            nav(`/explorer?q=${t}`);
          }}>
          {hideStr(t)}
        </span>
      ),
    },
    // {
    //   title: t('common.percentage'),
    //   dataIndex: 'percentage',
    //   key: 'percentage',
    // },
    {
      title: t('common.quantity'),
      dataIndex: 'value',
      align: 'center',
      key: 'value',
    },
  ];
  const dataSource: DataType[] = useMemo(
    () =>
      list.map((item) => ({
        address: item.wallet,
        value: item.total_balance,
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
    />
  );
};
