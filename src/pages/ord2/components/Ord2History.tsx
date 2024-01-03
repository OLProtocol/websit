import { Button, Segmented } from 'antd';
interface Ord2HistoryProps {
  tick: string;
  address: string;
}
export const Ord2History = ({ tick, address }: Ord2HistoryProps) => {
  return (
    <div className='rounded-2xl bg-gray-200 p-4'>
      <div className='mb-2'>
        <span className='text-orange-500'> {tick}</span>
        <span className='text-gray-500'>, transactions of </span>
        <span>{address}</span>
      </div>
      <div className='flex items-center mb-2'>
        <Button className='mr-2' color='rgb(249 115 22)'>
          View {tick}
        </Button>
      </div>
      <Segmented
        options={[
          'all',
          'inscribe-mint',
          'inscribe-transfer',
          'send',
          'receive',
        ]}
        block
      />
    </div>
  );
};
