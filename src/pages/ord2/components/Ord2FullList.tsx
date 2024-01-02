import { useEffect, useMemo } from 'react';
import { Space, Table, Tag } from 'antd';
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
  const list = useMemo(() => data?.detail?.[0] || [], [data]);
  useEffect(() => {}, []);
  const clickHandler = (item) => {
    nav(`/ord2/${item.tick}`);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tick',
      dataIndex: 'tick',
      key: 'tick',
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
  ];
  const dataSource: DataType[] = useMemo(
    () =>
      list.map((item) => ({
        tick: item.tick,
        block: `${item.block_start}-${item.block_end}`,
        rarity: item.rarity,
      })),
    [list],
  );
  return (
    <div className='max-w-6xl rounded-3xl p-4 mx-auto'>
      <h2 className='mb-2 font-bold text-lg text-center'>
        The full list of ord2
      </h2>

      <Table
        columns={columns}
        dataSource={dataSource}
        onRow={(record) => {
          return {
            onClick: () => clickHandler(record), // 点击行
          };
        }}
      />
    </div>
  );
};
