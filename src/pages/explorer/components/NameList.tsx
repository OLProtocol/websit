import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNameList } from '@/api';
import { useCommonStore } from '@/store';
import { BlockAndTime } from '@/components/BlockAndTime';
import { useNavigate } from 'react-router-dom';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { hideStr } from '@/lib/utils'
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/CopyButton';
import { removeObjectEmptyValue } from '../../inscribe/utils';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { generateMempoolUrl } from '@/lib/utils';
import { setCacheData, getCachedData } from '@/lib/utils/cache';
import { useNetwork } from '@/lib/wallet';

export const NameList = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const toast = useToast();

  const network = useNetwork();

  const [start, setStart] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  const clickHandler = (item) => {
    nav(`/explorer/ns/${item.name}`);
  };

  const { data, error, isLoading } = useNameList({ start, limit });
  const list = useMemo(() => data?.data?.names || [], [data]);
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
      return
    }
    if (data && data.code !== 0) {
      toast({
        title: data?.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return
    }
  }, [error, isLoading, data, toast]);



  const columns: ColumnsType<any> = [
    {
      title: t('common.index'),
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: t('common.ns'),
      dataIndex: 'name',
      key: 'name',
      width: 80,
      align: 'center',
      render: (name) => {
        return <div className='cursor-pointer'>{name}</div>;
      },
    },
    {
      title: t('common.address'),
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      render: (address) => {
        return <div className='cursor-pointer'>{hideStr(address)}</div>;
      },
    },
    {
      title: t('common.inscriptionId'),
      dataIndex: 'inscriptionId',
      key: 'inscriptionId',
      align: 'center',
      render: (t) => {
        const txid = t.replace(/i0$/m, '');
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
              onClick={() => nav(`/explorer/utxo/${t}`)}>
              {hideStr(t)}
            </span>
            <CopyButton text={t} tooltip='Copy Tick' />
          </div>
        );
      },
    },
  ];

  const dataSource: any[] = useMemo(
    () =>
      list.map((item, i) => {
        return {
          index: i + 1,
          ...item,
        };
      }),
    [list],
  );

  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
  };

  return (
    <Table
      bordered
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      pagination={{
        position: ['bottomCenter'],
        defaultPageSize: 10,
        total: total,
        onChange: paginationChange,
        showSizeChanger: false,
      }}
      scroll={{ x: 1000 }}
      onRow={(record) => {
        return {
          onClick: () => clickHandler(record), // 点击行
        };
      }}
    />
  );
};
