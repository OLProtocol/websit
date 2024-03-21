import { Button, Segmented, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useOrdxTickHistory } from '@/api';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hideStr } from '@/lib/utils';
import { CopyButton } from '@/components/CopyButton';

interface Ord2HistoryProps {
  tick: string;
}
export const OrdxTickHistory = ({ tick }: Ord2HistoryProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { network } = useUnisatConnect();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, trigger } = useOrdxTickHistory({
    ticker: tick,
    network,
    start,
    limit,
  });
  const columns: ColumnsType<any> = [
    {
      title: t('common.inscriptionNumber'),
      dataIndex: 'inscriptionNumber',
      key: 'inscriptionNumber',
      width: 100,
      align: 'center',
      render: (t: any) => {
        const href =
          network === 'testnet'
            ? `https://testnet.ordinals.com/inscription/${t}`
            : `https://ordinals.com/inscription/${t}`;
        return (
          <div>
            { t === 9223372036854775807 ? (
              <span>-</span>
            ) : (
              <a
                className='text-blue-500 cursor-pointer'
                href={href}
                target='_blank'>
                #{t}
              </a>
            )}
          </div>
        );
      },
    },
    {
      title: t('common.inscriptionId'),
      dataIndex: 'inscriptionId',
      key: 'inscriptionId',
      width: 100,
      align: 'center',
      render: (t) => {
        const href =
          network === 'testnet'
            ? `https://testnet.ordinals.com/inscription/${t}`
            : `https://ordinals.com/inscription/${t}`;
        return (
          <div className='flex item-center justify-center'>
            <a
              className='text-blue-500 cursor-pointer'
              href={href}
              target='_blank'>
              {hideStr(t)}
            </a>&nbsp;&nbsp;
            <CopyButton text={t} tooltip='Copy Btc Address' />
          </div>
        );
      },
    },
    {
      title: t('common.address'),
      dataIndex: 'wallet',
      key: 'wallet',
      width: 120,
      align: 'center',
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
      dataIndex: 'balance',
      key: 'balance',
      width: 130,
      align: 'center',
    },
  ];
  const dataSource = useMemo(() => data?.data?.detail || [], [data]);
  const total = useMemo(() => data?.data?.total || 10, [data]);
  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
    console.log(page, pageSize);
  };
  const toInfo = () => {
    nav(`/explorer/${tick}`);
  };
  useEffect(() => {
    if (tick) {
      trigger();
    }
  }, [tick, network, start, limit]);

  return (
    <div className=''>
      {/* <Segmented
        options={[
          'all',
          'inscribe-mint',
          'inscribe-transfer',
          'send',
          'receive',
        ]}
        block
      /> */}
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={dataSource.filter((item) => item.inscriptionNumber !== '9223372036854776000')}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 10,
          total: total,
          onChange: paginationChange,
          showSizeChanger: false,
        }}
        // onRow={(record) => {
        //   return {
        //     onClick: () => clickHandler(record), // 点击行
        //   };
        // }}
      />
    </div>
  );
};
