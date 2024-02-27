import { useEffect, useMemo, useState } from 'react';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { useOrdxAddressHistory } from '@/api';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Button } from 'antd';

const { Meta } = Card;

interface Props {
  item: any;
}
const TickerContent = ({ content }: any) => {
  return (
    <div className='h-36 border-b border-gray-100 bg-gray-200'>
      <div className='w-full h-full flex justify-center items-center break-words break-all p-4'>
        <p>{content}</p>
      </div>
    </div>
  );
};
export const OrdxItem = ({ item }: Props) => {
  return (
    <Card
      hoverable
      cover={
        <TickerContent
          content={JSON.stringify({
            p: 'ordx',
            op: 'mint',
            tick: item.ticker,
            amt: item.balance,
          })}
        />
      }
      actions={[
        <Button type='text' color='blue'>
          上架
        </Button>,
        <Button type='text' color='blue'>
          拆分
        </Button>,
      ]}>
      #{item.inscriptionNumber}
    </Card>
  );
};
