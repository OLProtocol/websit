interface Ord2ItemProps {
  item: {
    tick: string;
    balance: string;
  };
  onClick?: () => void;
}
export const OrdXItem = ({ item, onClick }: Ord2ItemProps) => {
  return (
    <div className='border-[1px] border-gray-200 rounded-lg overflow-hidden' onClick={onClick}>
      <div className='h-10 flex justify-between px-2 items-center bg-gray-200'>
        <span className='text-orange-500'>{item.tick}</span>
      </div>
      <div className='p-2 text-lg'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400 mr-8'>Balance:</span>
          <span className=''>{item.balance}</span>
        </div>
      </div>
    </div>
  );
};
