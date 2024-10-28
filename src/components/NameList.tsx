import { useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { genOrdinalsUrl, hideStr } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/CopyButton';
import { useToast } from '@chakra-ui/react';
import { useNameListHook } from '@/hooks/NameList';
import { IndexerLayer } from '@/api/type';

interface NameListProps {
  address: string;
  indexerLayer?: IndexerLayer;
  onTotalChange?: (total: number) => void;
}
export const NameList = ({ onTotalChange, address, indexerLayer = IndexerLayer.Base }: NameListProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { network, } = useReactWalletStore();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { value } = useNameListHook({ address, start, limit }, indexerLayer);

  const clickHandler = (item) => {
    nav(`/explorer/ns/${item.name}`);
  };

  const list = useMemo(() => value?.names || [], [value]);
  const total = useMemo(() => value?.total || 0, [value]);

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
        const inscriptionId = t;
        const href = genOrdinalsUrl({ network, path: `inscription/${inscriptionId}` })
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
    () => {
      return list.map((item, i) => {
        return {
          key: item.inscriptionId,
          index: i + 1,
          ...item,
        };
      })
    },
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
