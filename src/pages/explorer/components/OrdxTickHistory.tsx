/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { Button, Segmented, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSat20TickHistory } from '@/api';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';

import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hideStr } from '@/lib/utils';
import { CopyButton } from '@/components/CopyButton';

interface Sat20HistoryProps {
  tick: string;
}
export const Sat20TickHistory = ({ tick }: Sat20HistoryProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { network } = useReactWalletStore();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, trigger } = useSat20TickHistory({
    ticker: tick,
    network,
    start,
    limit,
  });

  const toInscriptionInfo = (inscriptionId) => {
    nav(`/explorer/inscription/${inscriptionId}`);
  };

  const columns: ColumnsType<any> = [
    {
      title: t('common.inscriptionNumber'),
      dataIndex: 'inscriptionNumber',
      key: 'inscriptionNumber',
      width: 100,
      align: 'center',
      render: (t: any, record) => {
        const href =
          network === 'testnet'
            ? `https://testnet.ordinals.com/inscription/${record.inscriptionId}`
            : `https://ordinals.com/inscription/${record.inscriptionId}`;
        return (
          <div>
            {t === 9223372036854775807 ? (
              <span>-</span>
            ) : (
              // <a
              //   className='text-blue-500 cursor-pointer'
              //   href={href}
              //   target='_blank'>
              //   #{t}
              // </a>
              <span
                className='text-blue-500 cursor-pointer'
                onClick={() => toInscriptionInfo(record.inscriptionId)}>
                #{t}
              </span>
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
            <span
              className='text-blue-500 cursor-pointer'
              onClick={() => toInscriptionInfo(t)}>
              {hideStr(t)}
            </span>&nbsp;&nbsp;
            {/* <a
              className='text-blue-500 cursor-pointer'
              href={href}
              target='_blank'>
              {hideStr(t)}
            </a>&nbsp;&nbsp; */}
            <CopyButton text={t} tooltip='Copy Inscription ID' />
          </div>
        );
      },
    },
    {
      title: t('common.address'),
      dataIndex: 'mintaddress',
      key: 'mintaddress',
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
  const dataSource = useMemo(() => data?.data?.detail.items || [], [data]);
  const total = useMemo(() => data?.data?.total || 10, [data]);
  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
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
