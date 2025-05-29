import { useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRuneList } from '@/swr';
import { useNavigate } from 'react-router-dom';
import { generateMempoolUrl, hideStr } from '@/lib/utils'
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/CopyButton';
import { useToast } from '@chakra-ui/react';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { TickerInfo } from '@/api/type';

export const RunesList = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const toast = useToast();
  const [start, setStart] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const { data, total, error, isLoading } = useRuneList({ start, limit });
  
  const list = useMemo(() => data || [], [data]);
    const { network } = useReactWalletStore((state) => state);

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
    // {
    //   title: t('common.index'),
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: 80,
    //   align: 'center',
    // },
    {
      title: t('runes.id'),
      dataIndex: 'id',
      key: 'id',
      width: 10,
      align: 'center',
      render: (id) => {
        return <div className='cursor-pointer'>{id} 111</div>;
      },
    },
    {
      title: t('runes.name'),
      dataIndex: 'displayTicker',
      key: 'displayTicker',
      width: 180,
      align: 'center',
      render: (displayTicker) => {
        return <div className='cursor-pointer'>{displayTicker}</div>;
      },
    },

    {
      title: t('runes.deployHeight'),
      dataIndex: 'deployHeight',
      key: 'deployHeight',
      width: 90,
      align: 'center',
      render: (deployHeight) => {
        return <div className='cursor-pointer'>{deployHeight}</div>;
      },
    },
    {
      title: t('runes.deployBlockTime'),
      dataIndex: 'deployBlockTime',
      key: 'deployBlockTime',
      width: 140,
      align: 'center',
      render: (deployBlockTime) => {
        const date = new Date(deployBlockTime * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        return <div className='cursor-pointer'>{`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</div>;
      },
    },
    {
      title: t('runes.deployTx'),
      dataIndex: 'deployTx',
      key: 'deployTx',
      width: 20,
      align: 'center',
      render: (deployTx) => {
        // return <div className='cursor-pointer'>{deployTx}</div>;

        return (
          <div className='flex item-center justify-center'>
            <span
              className='text-blue-500 cursor-pointer mr-2'
              onClick={(e) => {
                e.stopPropagation();
                const url = generateMempoolUrl({network: network, path: `tx/${deployTx}` });
                window.open(url, '_blank');1
              }}>
              {hideStr(deployTx)}
            </span>
            <CopyButton text={deployTx} tooltip='Copy' />
          </div>
        );
      },
    },

    {
      title: t('runes.holdersCount'),
      dataIndex: 'holdersCount',
      key: 'holdersCount',
      width: 100,
      align: 'center',
      render: (holdersCount) => {
        return <div className='cursor-pointer'>{holdersCount}</div>;
      },
    },

  ];

  const dataSource: any[] = useMemo(
    () => {
      return list.map((item) => {
        return {
          ...item,
          displayTicker: item.name?.Ticker,
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
      onRow={(record: TickerInfo) => {
        return {
          onClick: (e) => {
            e.stopPropagation();
            const rune = `${record.name.Protocol}:${record.name.Type}:${record.name.Ticker}`;
            nav(`/explorer/rune/${rune}`);
          }
        };
      }}
    />
  );
};
