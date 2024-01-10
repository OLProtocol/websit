import { useEffect, useMemo } from 'react';
import { Segmented, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useOrd2Status } from '@/api';
import { useNavigate } from 'react-router-dom';
interface DataType {
  tick: string;
  block: string;
  rarity: number;
}

export const Ord2FullList = () => {
  const nav = useNavigate();
  const { data } = useOrd2Status({ start: 0, limit: 10 });
  const list = useMemo(() => data?.detail || [], [data]);
  useEffect(() => {}, []);
  const clickHandler = (item) => {
    nav(`/ordx/${item.tick}`);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tick',
      dataIndex: 'tick',
      key: 'tick',
      fixed: 'left',
      width: 100,
      align: 'center',
    },
    {
      title: 'Deploy Time',
      dataIndex: 'deploy_time',
      key: 'deploy_time',
      width: 200,
      align: 'center',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      align: 'center',
      render: (t) => t || '-'
    },
    {
      title: 'Limit',
      dataIndex: 'limit',
      key: 'limit',
      width: 100,
      align: 'center',
    },
    {
      title: 'Block',
      dataIndex: 'block',
      key: 'block',
      width: 200,
      align: 'center',
    },
    {
      title: 'Deploy Height',
      dataIndex: 'deployHeight',
      key: 'deployHeight',
      width: 150,
      align: 'center',
    },

    {
      title: 'Regular Expression',
      dataIndex: 'reg',
      key: 'reg',
      width: 200,
      align: 'center',
      render: (t) => t || '-'
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      width: 100,
      align: 'center',
      render: (rarity) => {
        return (
          <Tag color='green' key={rarity}>
            {rarity}
          </Tag>
        );
      },
    },
    {
      title: 'Max Supply',
      dataIndex: 'holders',
      key: 'supply',
      width: 100,
      align: 'center',
    },
    {
      title: 'Minted',
      dataIndex: 'minted',
      key: 'minted',
      fixed: 'right',
      width: 100,
      align: 'center',
    },
  ];
  const dataSource: DataType[] = useMemo(
    () =>
      list.map((item) => ({
        tick: item.ticker,
        block: `${item.startBlock}-${item.endBlock}`,
        rarity: item.rarity,
        description: item.description,
        reg: item.reg,
        holders: item.holdersCount,
        deployHeight: item.deployHeight,
        minted: item.totalMinted,
        limit: item.limit,
        deploy_time: new Date(item.deployBlocktime).toLocaleString(),
      })),
    [list],
  );
  return (
    <div className='rounded-3xl p-4 mx-auto bg-gray-200'>
      <h2 className='mb-2 font-bold text-lg text-center'>
        The full list of ordx
      </h2>
      <div className='flex mb-4 justify-center'>
        <Segmented
          options={['All', 'In-Progress', 'Completed']}
          block
          className='w-80'
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          position: ['bottomCenter'],
        }}
        scroll={{ x: 1450 }}
        onRow={(record) => {
          return {
            onClick: () => clickHandler(record), // 点击行
          };
        }}
      />
    </div>
  );
};
