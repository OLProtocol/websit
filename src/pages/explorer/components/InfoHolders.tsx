import { useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useOrdxTickHolders } from '@/api';
import { useReactWalletStore } from 'btc-connect/dist/react';

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
  const { network } = useReactWalletStore();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, trigger } = useOrdxTickHolders({
    tick,
    network,
    start,
    limit
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
      list.map((item, index) => ({
        key: index,
        address: item.wallet,
        value: item.total_balance,
        percentage: (item.total_balance / totalQuantity * 100).toFixed(2) + '%',
      })),
    [list],
  );
  const total = useMemo(() => data?.data?.total || 10, [data]);

  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
  };

  return (
    <div>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 10,
          total: total,
          onChange: paginationChange,
          showSizeChanger: false,
        }}
      />
    </div>
    // <Table
    //   columns={columns}
    //   dataSource={dataSource}
    //   pagination={{
    //     position: ['bottomCenter'],
    //   }}
    // />
  );
};
