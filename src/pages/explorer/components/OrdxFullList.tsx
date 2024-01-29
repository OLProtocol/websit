import { useEffect, useMemo, useState } from 'react';
import { Segmented, Table, Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useOrd2Status } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { useTranslation } from 'react-i18next';

interface DataType {
  tick: string;
  block: string;
  rarity: number;
}

export const Ord2FullList = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { network } = useUnisatConnect();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useOrd2Status({ start, limit, network });
  const list = useMemo(() => data?.detail || [], [data]);
  const total = useMemo(() => data?.total || 10, [data]);
  console.log(data);
  const height = useMemo(() => {
    return data?.height;
  }, [data]);
  const clickHandler = (item) => {
    nav(`/explorer/${item.tick}`);
  };
  const toInscribe = (e: any, item: any) => {
    e.stopPropagation();
    nav('/inscribe', { state: { type: 'ordx', item } });
  };
  const columns: ColumnsType<DataType> = [
    {
      title: t('common.tick'),
      dataIndex: 'tick',
      key: 'tick',
      fixed: 'left',
      width: 100,
      align: 'center',
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      key: 'description',
      width: 120,
      align: 'center',
      render: (t) => t || '-',
    },
    {
      title: t('common.block'),
      dataIndex: 'block',
      key: 'block',
      width: 100,
      align: 'center',
    },
    {
      title: t('common.deploy_height'),
      dataIndex: 'deployHeight',
      key: 'deployHeight',
      width: 90,
      align: 'center',
    },
    {
      title: t('common.limit'),
      dataIndex: 'limit',
      key: 'limit',
      width: 80,
      align: 'center',
    },
    {
      title: t('common.satAttr'),
      dataIndex: 'attr',
      key: 'attr',
      width: 100,
      align: 'center',
      render: (t) => t || '-',
    },
    {
      title: t('common.holders'),
      dataIndex: 'holders',
      key: 'holders',
      width: 60,
      align: 'center',
    },
    {
      title: t('common.minted'),
      dataIndex: 'minted',
      key: 'minted',
      width: 60,
      align: 'center',
    },
    {
      title: t('common.deploy_time'),
      dataIndex: 'deploy_time',
      key: 'deploy_time',
      width: 140,
      align: 'center',
    },

    // {
    //   title: t('common.rarity'),
    //   dataIndex: 'rarity',
    //   key: 'rarity',
    //   width: 100,
    //   align: 'center',
    //   render: (rarity) => {
    //     return rarity && rarity !== 'unknow' ? (
    //       <Tag color='green' key={rarity}>
    //         {rarity}
    //       </Tag>
    //     ) : (
    //       '-'
    //     );
    //   },
    // },
    // {
    //   title: t('common.trz'),
    //   dataIndex: 'trz',
    //   key: 'trz',
    //   width: 200,
    //   align: 'center',
    //   render: (t) => t || '-',
    // },

    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 70,
      align: 'center',
      render: (status, record) => {
        if (status === 'Pending') {
          return (
            <Tag color='orange' key={status}>
              {t('common.waiting')}
            </Tag>
          );
        } else if (status === 'Minting') {
          return (
            <Button type='link' onClick={(e) => toInscribe(e, record)}>
              {t('common.minting')}
            </Button>
          );
        }
        return (
          <Tag color='blue' key={status}>
            {t('common.completed')}
          </Tag>
        );
      },
    },
  ];
  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
    console.log(page, pageSize);
  };
  const dataSource: DataType[] = useMemo(
    () =>
      list.map((item) => {
        let status;
        console.log(
          item.startBlock &&
            item.endBlock &&
            height < item.endBlock &&
            height > item.startBlock,
        );
        if (item.rarity !== 'unknow' && item.rarity !== 'common') {
          status = 'Minting';
        } else if (
          item.startBlock &&
          item.endBlock &&
          height < item.endBlock &&
          height > item.startBlock
        ) {
          status = 'Minting';
        } else if (height < item.startBlock) {
          status = 'Pending';
        } else {
          status = 'Completed';
        }
        console.log(status);
        return {
          tick: item.ticker,
          block: `${item.startBlock}-${item.endBlock}`,
          rarity: item.rarity,
          description: item.description,
          reg: item.reg,
          holders: item.holdersCount,
          deployHeight: item.deployHeight,
          minted: item.totalMinted,
          limit: item.limit,
          status,
          deploy_time: new Date(item.deployBlocktime).toLocaleString(),
        };
      }),
    [list, height],
  );
  return (
    <div className='rounded-3xl p-4 mx-auto bg-gray-200'>
      <h2 className='mb-2 font-bold text-lg text-center'>
        {t('pages.explorer.list_title')}
      </h2>
      {/* <div className='flex mb-4 justify-center'>
        <Segmented
          options={['All', 'In-Progress', 'Completed']}
          block
          className='w-80'
        />
      </div> */}
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
        scroll={{ x: 920 }}
        onRow={(record) => {
          return {
            onClick: () => clickHandler(record), // 点击行
          };
        }}
      />
    </div>
  );
};
