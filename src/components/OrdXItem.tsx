import { useTranslation } from 'react-i18next';
interface Ord2ItemProps {
  item: {
    tick: string;

    balance: string;
  };
  selected?: boolean;
  onClick?: () => void;
}
export const OrdXItem = ({ item, onClick, selected }: Ord2ItemProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={`border-[2px] border-gray-200 rounded-lg overflow-hidden ${
        selected ? 'border-orange-500 border-[2px]' : ''
      }`}
      onClick={onClick}>
      <div className='h-10 flex justify-between px-2 items-center bg-gray-200'>
        <span className='text-orange-500'>{item.tick}</span>
      </div>
      <div className='p-2 text-lg'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400 mr-8'>{t('common.balance')}:</span>
          <span className=''>{item.balance}</span>
        </div>
      </div>
    </div>
  );
};
