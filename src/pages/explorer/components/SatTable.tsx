import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SatItem } from './SatItem';
interface SatTableProps {
  sats: any[];
  canSplit: boolean;
}
interface DataType {
  start: number;
  size: number;
  time: string;
  block: number;
  canSplit: boolean;
}
export const SatTable = ({ sats, canSplit }: SatTableProps) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Sat',
      dataIndex: 'sat',
      key: 'sat',
      align: 'center',
      render(_, record) {
        record.canSplit = canSplit;
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
              pageSize: 10,
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
