import React, { useMemo, useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SatItem } from './SatItem';
import { position } from '@chakra-ui/react';
interface SatInterstingBoxProps {
  sats: any[];
}
interface DataType {
  sat: number[];
  time: string;
  block: number;
}
export const SatInterstingBox = ({ sats }: SatInterstingBoxProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const columns: ColumnsType<DataType> = [
    {
      title: 'Sat',
      dataIndex: 'sat',
      key: 'sat',
      align: 'center',
      render(_, record) {
        return <SatItem sat={record} />;
      },
    },
    // {
    //   title: 'Time',
    //   dataIndex: 'time',
    //   key: 'time',
    //   align: 'center',
    // },
    // {
    //   title: 'Block',
    //   dataIndex: 'block',
    //   key: 'block',
    //   align: 'center',
    //   render: (t) => <Tag color='green'>Blk#{t}</Tag>,
    // },
  ];
  const list = useMemo(() => {
    if (filterType === 'all') {
      return sats;
    }
    return sats.filter((item) => item.types.includes(filterType));
  }, [sats, filterType]);
  return (
    <div className='rounded-2xl bg-gray-200 p-4'>
      <h3 className='text-2xl mb-2'>Intersting Sats</h3>
      <div>
        {/* {list.map((item, index) => (
          <SatItem key={index} sat={item} />
        ))} */}
        <Table
          showHeader={false}
          columns={columns}
          dataSource={list}
          pagination={{
            position: ['bottomCenter'],
          }}
          // onRow={(record) => {
          //   return {
          //     onClick: () => clickHandler(record), // 点击行
          //   };
          // }}
        />
      </div>
    </div>
  );
};
