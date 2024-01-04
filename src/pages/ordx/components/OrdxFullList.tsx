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
    },
    {
      title: 'Deploy Time',
      dataIndex: 'deploy_time',
      key: 'deploy_time',
    },
    {
      title: 'Block',
      dataIndex: 'block',
      key: 'block',
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (rarity) => {
        return (
          <Tag color='green' key={rarity}>
            {rarity}
          </Tag>
        );
      },
    },
    {
      title: 'Holders',
      dataIndex: 'holders',
      key: 'holders',
    },
  ];
  const dataSource: DataType[] = useMemo(
    () =>
      list.map((item) => ({
        tick: item.ticker,
        block: `${item.startBlock}-${item.endBlock}`,
        rarity: item.rarity,
        holders: item.holdersCount,
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
        <Segmented options={['All', 'In-Progress', 'Completed']} block className='w-80' />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          position: ['bottomCenter'],
        }}
        onRow={(record) => {
          return {
            onClick: () => clickHandler(record), // 点击行
          };
        }}
      />
    </div>
  );
};
