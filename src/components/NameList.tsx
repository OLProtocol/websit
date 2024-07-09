import { useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNsListByAddress } from '@/api';
import { useCommonStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { genOrdinalsUrl, hideStr } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/CopyButton';
import { useToast } from '@chakra-ui/react';
import { generateMempoolUrl } from '@/lib/utils';

interface NameListProps {
  address: string;
  onTotalChange?: (total: number) => void;
}
export const NameList = ({ onTotalChange, address }: NameListProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { btcHeight } = useCommonStore((state) => state);
  const { network, } = useReactWalletStore();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);

  // const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const clickHandler = (item) => {
    nav(`/explorer/ns/${item.name}`);
  };
  console.log(start);
  const { data } = useNsListByAddress({
    address: address,
    start,
    limit,
    network,
  });
  const list = useMemo(() => data?.data?.names || [], [data]);
  const total = useMemo(() => data?.data?.total || 0, [data]);

  useEffect(() => {
    onTotalChange?.(total), [total];
  }, [total]);
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
      title: t('common.inscriptionId'),
      dataIndex: 'inscriptionId',
      key: 'inscriptionId',
      align: 'center',
      render: (t) => {
        // const txid = t.replace(/i0$/m, '');
        const inscriptionId = t;
        const href = genOrdinalsUrl({ network, path: `inscription/${inscriptionId}` })
        // const href = generateMempoolUrl({ network, path: `tx/${txid}` });
        return (
          <a
            className='text-blue-500 cursor-pointer'
            href={href}
            target='_blank'
            onClick={(e) => e.stopPropagation()}>
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
              onClick={(e) => {
                e.stopPropagation();
                nav(`/explorer/utxo/${t}`)
              }}>
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
