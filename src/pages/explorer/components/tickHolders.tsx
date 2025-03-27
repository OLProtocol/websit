import { useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTickHolderListV3 } from '@/swr';
import { useTranslation } from 'react-i18next';
import { hideStr } from '@/lib/utils';
import { CopyButton } from '@/components/CopyButton';
import { useNetwork } from '@/lib/wallet';
import BigNumber from 'bignumber.js';

interface DataType {
  address: string;
  percentage: string;
  value: string;
}
interface InfoHoldersProps {
  ticker: string;
  totalQuantity: string ;
  divisibility: number
}
export const TickHolders = ({ ticker, totalQuantity, divisibility }: InfoHoldersProps) => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const network = useNetwork();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data: resp, isLoading, error,trigger } = useTickHolderListV3({
    ticker,
    start,
    limit
  });

  const list = useMemo(() => resp?.detail, [resp]);
  useEffect(() => {
    trigger();
  }, [network, ticker]);

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
  const dataSource = useMemo(
    () =>
      list?.map((item, index) => {
        return ({
        key: index,
        address: item.wallet,
        value: item.total_balance,
        percentage: new BigNumber(item.total_balance)
          .dividedBy(new BigNumber(totalQuantity))
          .dividedBy(new BigNumber(10).pow(divisibility))
          .multipliedBy(100)
          .toFixed(2) + '%',
      })}),
    [list, totalQuantity],
  );
  const total = useMemo(() => {
    // debugger
    return resp?.total || 10
  }, [resp]);

  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
    trigger();
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
  );
};
