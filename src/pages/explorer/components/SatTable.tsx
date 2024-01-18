import React, { useMemo, useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SatItem } from './SatItem';
import { position } from '@chakra-ui/react';
interface SatTableProps {
  sats: any[];
}
interface DataType {
  sat: number[];
  time: string;
  block: number;
}
export const SatTable = ({ sats }: SatTableProps) => {
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
  ];
  return (
    <div className='sat-box'>
      <Table
        className='bg-transparent'
        showHeader={false}
        columns={columns}
        dataSource={sats}
        rowClassName='bg-transparent'
        pagination={
          sats.length > 10
            ? {
                position: ['bottomCenter'],
              }
            : false
        }
        // onRow={(record) => {
        //   return {
        //     onClick: () => clickHandler(record), // 点击行
        //   };
        // }}
      />
    </div>
  );
};
