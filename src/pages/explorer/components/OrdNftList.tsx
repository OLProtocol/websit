import { Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNftList } from '@/api';
import { CopyButton } from '@/components/CopyButton';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { generateMempoolUrl } from '@/lib/utils';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { hideStr } from '@/lib/utils';
import { Card, CardBody, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useNetwork } from '@/lib/wallet';

export const OrdNftList = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const toast = useToast();

  const network = useNetwork();
  const router = useNavigate();

  const [start, setStart] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  const { data, error, isLoading } = useNftList({ start, limit })
  const list = useMemo(() => data?.data?.nfts || [], [data]);
  const total = useMemo(() => data?.data?.total || 0, [data]);

  useEffect(() => {
    setLoading(isLoading);
    if (error) {
      toast({
        title: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    if (data && data.code !== 0) {
      toast({
        title: data?.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, isLoading, data, toast]);

  const columns: ColumnsType<any> = [
    {
      title: t('common.inscriptionId'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (t) => {
        const txid = t?.replace(/i0$/m, '');
        const href = generateMempoolUrl({
          network,
          path: `tx/${txid}`,
        });
        return (
          <a
            className='text-blue-500 cursor-pointer'
            href={href}
            target='_blank'>
            {hideStr(t)}
          </a>
        );
      },
    },
    {
      title: 'UTXO',
      dataIndex: 'utxo',
      key: 'utxo',
      align: 'center',
      render: (t) => {
        return (
          <div className='flex item-center justify-center'>
            <span
              className='text-blue-500 cursor-pointer mr-2'
              onClick={() => router(`/explorer/utxo/${t}`)}>
              {hideStr(t)}
            </span>
            <CopyButton text={t} tooltip='Copy Tick' />
          </div>
        );
      },
    },
    {
      title: 'Sat',
      dataIndex: 'sat',
      key: 'sat',
      align: 'center',
      render: (t) => {
        return (
          <div className='flex item-center justify-center'>
            <span
              className='text-blue-500 cursor-pointer mr-2'
              onClick={() => nav(`/ord/inscriptions/sat/${t}`)}>
              {t}
            </span>
            <CopyButton text={t} tooltip='Copy Tick' />
          </div>
        );
      },
    },
    {
      title: t('common.mint_time'),
      dataIndex: 'mintTime',
      key: 'mintTime',
      align: 'center',
      render: (t) => {
        return <span>{new Date(t * 1000).toLocaleString('af')}</span>;
      },
    },
    {
      title: t('common.geneses_address'),
      dataIndex: 'genesesAddress',
      key: 'genesesAddress',
      align: 'center',
      render: (t) => {
        return (
          <a
            className='text-blue-500 cursor-pointer'
            onClick={() => nav(`/ord/inscriptions/address/${t}`)}>
            {hideStr(t)}
          </a>
        );
      },
    },
  ];

  const dataSource = useMemo(
    () =>
      list.map((v) => ({
        id: v.inscriptionId,
        sat: v.sat,
        address: v.address,
        utxo: v.utxo,
        mintTime: v.time,
        genesesAddress: v.inscriptionAddress,
      })) || [],
    [list],
  );

  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
  };

  return (
    // <Card>
    //   <CardBody>
    <Table
      bordered
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      scroll={{ x: 800 }}
      pagination={{
        position: ['bottomCenter'],
        defaultPageSize: 10,
        total: total,
        onChange: paginationChange,
        showSizeChanger: false,
      }}
    />
    //   </CardBody>
    // </Card>
  );
};
