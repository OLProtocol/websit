import { useEffect, useMemo } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useOrdxTickHolders } from '@/api';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { useTranslation } from 'react-i18next';
import { hideStr } from '@/lib/utils';
import { CopyButton } from '@/components/CopyButton';

interface DataType {
  rank: string;
  address: string;
  percentage: string;
  value: number;
}
interface InfoHoldersProps {
  tick: string;
  totalQuantity: number;
}
export const InfoHolders = ({ tick, totalQuantity }: InfoHoldersProps) => {
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
    {
      title: t('common.address'),
      dataIndex: 'address',
      align: 'center',
      key: 'address',
      render: (t) => (
        <div className='flex item-center justify-center'>
          <span
            className='text-blue-500 cursor-pointer'
            onClick={() => {
              nav(`/explorer?q=${t}`);
            }}>
            {hideStr(t)}
          </span>&nbsp;&nbsp;
          <CopyButton text={t} tooltip='Copy Btc Address' />
        </div>
      ),
    },
    {
      title: t('common.quantity'),
      dataIndex: 'value',
      align: 'center',
      key: 'value',
    },
    {
      title: t('common.quantity_percentage'),
      dataIndex: 'percentage',
      align: 'center',
      key: 'percentage',
    },
  ];
  const dataSource: DataType[] = useMemo(
    () => 
      list.map((item) => ({
        address: item.wallet,
        value: item.total_balance,
        percentage: (item.total_balance / totalQuantity * 100).toFixed(2) + '%',
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
