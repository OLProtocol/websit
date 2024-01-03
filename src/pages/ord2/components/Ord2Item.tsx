interface Ord2ItemProps {
  item: {
    tick: string;
    transferable: string;
    available: string;
    balance: string;
  };
}
export const Ord2Item = ({ item }: Ord2ItemProps) => {
  return (
    <div className='border-[1px] border-gray-200 rounded-lg overflow-hidden'>
      <div className='h-10 flex justify-between px-2 items-center bg-gray-200'>
        <span className='text-orange-500'>{item.tick}</span>
      </div>
      <div className='p-2 text-lg'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400 mr-8'>Transferable:</span>
          <span className=''>{item.transferable}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400 mr-8'>Available:</span>
          <span className=''>{item.available}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400 mr-8'>Balance:</span>
          <span className=''>{item.balance}</span>
        </div>
      </div>
    </div>
  );
};