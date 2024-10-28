import { useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNameStatusList } from '@/swr';
import { useNavigate } from 'react-router-dom';
import { hideStr } from '@/lib/utils'
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/CopyButton';
import { useToast } from '@chakra-ui/react';

export const NameList = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const toast = useToast();
  const [start, setStart] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const { data, error, isLoading } = useNameStatusList({ start, limit });
  const list = useMemo(() => data?.names || [], [data]);
  const total = useMemo(() => data?.total || 0, [data]);

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
        // const txid = t.replace(/i0$/m, '');
        // const href = generateMempoolUrl({
        //   network,
        //   path: `tx/${txid}`,
        // });
        return (
          <div
            className='text-blue-500 cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              nav(`/explorer/inscription/${t}`)
            }
            }
          >
            {hideStr(t)}
          </div>
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

  const dataSource: any[] = useMemo(
    () => {
      return list.map((item, i) => {
        return {
          index: i + 1,
          ...item,
        };
      })
    },
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
          onClick: (e) => {
            e.stopPropagation();
            nav(`/explorer/ns/${record.name}`);
          }
        };
      }}
    />
  );
};
