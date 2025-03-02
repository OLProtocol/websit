import { useTranslation } from 'react-i18next';
import { getAssetTypeLabel } from '@/lib/utils';
interface AssetProps {
  item: {
    ticker: string;
    balance: string;
  };
  selected?: boolean;
  onClick?: () => void;
}
export const AssetSummary = ({ item, onClick, selected }: AssetProps) => {
  const { t } = useTranslation();
  return (
    <div key={item.ticker}
      className={`m-4 border-[2px] border-gray-200 rounded-lg overflow-hidden ${selected ? 'border-orange-500 border-[2px]' : ''
        }`}
      onClick={onClick}>
      <div className='h-10 flex justify-between px-2 items-center bg-gray-200'>
        <span className='text-orange-500'>{getAssetTypeLabel(item.ticker)}</span>
      </div>
      <div className='p-2'>
        <div className='flex items-center justify-between'>
          {(item.ticker === t('pages.account.ord_nft') || item.ticker === t('pages.account.rare_sats')) ? (
            <span className='text-gray-400 mr-8'>Total:</span>
          ) : (
            <span className='text-gray-400 mr-8'>{t('common.balance')}:</span>
          )}
          <span className=''>{item.balance}</span>
        </div>
      </div>
    </div>
  );
};
