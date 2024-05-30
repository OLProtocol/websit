import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNsList, health } from '@/api';
import { useCommonStore } from '@/store';
import { BlockAndTime } from '@/components/BlockAndTime';
import { useNavigate } from 'react-router-dom';
import { useReactWalletStore } from 'btc-connect/dist/react';
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
import { cacheData, getCachedData } from '@/lib/utils/cache';


export const OrdxNameList = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { btcHeight } = useCommonStore((state) => state);
  const { network, address: currentAccount } = useReactWalletStore();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);

  // const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const clickHandler = (item) => {
    nav(`/explorer/ns/${item.name}`);
  };

  const { data } = useNsList(network);
  const list = useMemo(() => data?.data?.names || [], [data]);
  const total = useMemo(() => data?.data?.total || 10, [data]);

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
        const href =
          network === 'testnet'
            ? `https://mempool.space/testnet/tx/${txid}`
            : `https://mempool.space/tx/${txid}`;
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

  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
  };

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

  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
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
