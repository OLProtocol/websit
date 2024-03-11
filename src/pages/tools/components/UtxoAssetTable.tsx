import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
interface AssetTableProps {
  assets: any[];
}
interface DataType {
  ticker: string;
  amount: number;
}
export const UtxoAssetTable = ({ assets }: AssetTableProps) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Ticker',
      dataIndex: 'ticker',
      key: 'ticker',
      align: 'center',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    },
  ];
  return (
    <Table
      className='bg-transparent bg-gray-200'
      showHeader={true}
      columns={columns}
      dataSource={assets}
      rowClassName='bg-transparent'
      pagination={
        assets.length > 10
          ? {
              position: ['bottomCenter'],
              pageSize: 20,
            }
          : false
      }
    />
  );
};
