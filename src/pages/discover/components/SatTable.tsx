import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SatItem } from './SatItem';
import { useMemo } from 'react';
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

  const generateData = () => {
    if (!sats) return [];
    const datas: any[] = [];

    const utxos = {};
    sats.forEach((sat) => {
      const utxo = sat.utxo;
      const value = sat.value;

      if (utxos[utxo]) {
        utxos[utxo].sats.push(sat);
      } else {
        utxos[utxo] = {
          value: value,
          sats: [sat]
        };
      }
    })

    Object.keys(utxos).map((key) => {
      const item = {
        key: key,
        utxo: key,
        value: utxos[key].value,
        sats: utxos[key].sats,
      }
      datas.push(item);
    })
    return datas;
  };

  const dataSource = useMemo(() => {
    return generateData();
  }, [sats]);
  console.log("dataSource", dataSource);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Sat',
      dataIndex: 'utxo',
      key: 'utxo',
      align: 'center',
      render(_, record) {
        record.canSplit = canSplit;
        return <SatItem utxo={record} />;
      },
    },
  ];
  return (
    <div>

      <Table
        className='bg-transparent bg-gray-200'
        showHeader={false}
        columns={columns}
        dataSource={dataSource}
        rowClassName='bg-transparent'
        pagination={
          sats.length > 10
            ? {
              position: ['bottomCenter'],
              pageSize: 10,
            }
            : false
        }
      />
      <p>Hostname: {location.hostname}</p>
    </div>

  );
};
