import { useTranslation } from 'react-i18next';

interface listTypeItemrops {
  item: {
    tick: string;
    balance: string;
  };
  selected?: boolean;
  onClick?: () => void;
}
export const ListTypeItem = ({ item, onClick, selected }: listTypeItemrops) => {
  const { t } = useTranslation();
  return (
    <div
      className={`m-4 border-[2px] border-gray-200 rounded-lg overflow-hidden ${selected ? 'border-orange-500 border-[2px]' : ''
        }`}
      onClick={onClick}>
      <div className='h-10 flex justify-between px-2 items-center bg-gray-200'>
        <span className='text-orange-500'>{item.tick}</span>
      </div>
      <div className='p-2'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400 mr-8'>{t('common.balance')}:</span>
          <span className=''>{item.balance}</span>
        </div>
      </div>
    </div>
  );
};
