import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SatItem } from './SatItem';
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
    <Table
      className='bg-transparent bg-gray-200'
      showHeader={false}
      columns={columns}
      dataSource={sats}
      rowClassName='bg-transparent'
      pagination={
        sats.length > 10
          ? {
              position: ['bottomCenter'],
              pageSize: 20,
            }
          : false
      }
      // onRow={(record) => {
      //   return {
      //     onClick: () => clickHandler(record), // 点击行
      //   };
      // }}
    />
  );
};
