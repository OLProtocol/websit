import { Button, Segmented, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useOrdxAddressHolders } from '@/api';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hideStr } from '@/lib/utils';

interface Ord2HistoryProps {
  tick: string;
  address: string;
  onEmpty?: (b: boolean) => void;
}
export const OrdxAddressHolders = ({
  tick,
  address,
  onEmpty,
}: Ord2HistoryProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { network } = useUnisatConnect();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, trigger } = useOrdxAddressHolders({
    ticker: tick,
    address,
    network,
    start,
    limit,
  });
  const columns: ColumnsType<any> = [
    {
      title: 'utxo',
      dataIndex: 'utxo',
      key: 'utxo',
      width: 100,
      align: 'center',
      // render: (t) => {
      //   const txid = t.replace(/i0$/m, '')
      //   const href =
      //     network === 'testnet'
      //       ? `https://mempool.space/testnet/tx/${txid}`
      //       : `https://mempool.space/tx/${txid}`;
      //   return (
      //     <a
      //       className='text-blue-500 cursor-pointer'
      //       href={href}
      //       target='_blank'>
      //       {hideStr(txid)}
      //     </a>
      //   );
      // },
    },
    {
      title: t('common.inscriptionNumber'),
      dataIndex: 'inscriptionnum',
      key: 'inscriptionnum',
      width: 100,
      align: 'center',
      render: (t) => {
        const href =
          network === 'testnet'
            ? `https://testnet.ordinals.com/inscription/${t}`
            : `https://ordinals.com/inscription/${t}`;
        return (
          <a
            className='text-blue-500 cursor-pointer'
            href={href}
            target='_blank'>
            #{t}
          </a>
        );
      },
    },
    {
      title: 'Sats Ranges',
      dataIndex: 'ranges',
      key: 'ranges',
      width: 120,
      align: 'center',
      render: (t) => {
        const ranges = t.map((r: any) => `${r.start}-${r.start + r.size - 1}`);
        return ranges.join(', ');
      },
    },
    {
      title: t('common.quantity'),
      dataIndex: 'amount',
      key: 'amount',
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
    onEmpty?.(dataSource.length === 0);
  }, [dataSource]);
  useEffect(() => {
    console.log(address, tick);
    if (address && tick) {
      trigger();
    }
  }, [address, tick, network, start, limit]);

  return (
    <>
      {dataSource.length ? (
        <div className='rounded-2xl bg-gray-200 p-4'>
          <div className='mb-2'>
            <span className='text-orange-500'> {tick}</span>
            <span className='text-gray-500'>, {t('common.founder')}: </span>
            <span>{address}</span>
          </div>
          <div className='flex items-center mb-2'>
            <Button className='mr-2' color='rgb(249 115 22)' onClick={toInfo}>
              {t('buttons.view')} {tick}
            </Button>
          </div>
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
            dataSource={dataSource}
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
      ) : (
        <div></div>
      )}
    </>
  );
};
