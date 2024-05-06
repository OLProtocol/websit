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
    let datas: any[] = [];

    let utxos = {};
    sats.forEach((sat) => {
      let utxo = sat.utxo;
      let value = sat.value;
      
      if (utxos.hasOwnProperty(utxo)) {
        utxos[utxo].sats.push(sat);
      } else {
        utxos[utxo] = {
          value: value,
          sats: [sat]
        };
      }
    })

    Object.keys(utxos).map((key) => {
      let item = {
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

  const columns: ColumnsType<DataType> = [
    {
      title: 'Sat',
      dataIndex: 'sat',
      key: 'sat',
      align: 'center',
      render(_, record) {
        record.canSplit = canSplit;
        return <SatItem utxo={record} />;
      },
    },
  ];
  return (
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
  );
};
