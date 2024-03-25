import { useUnisatConnect } from '@/lib/hooks';
import { useTranslation } from 'react-i18next';
import { ItemList } from './components/ItemList';

export default function Account() {
  const { t } = useTranslation();
  const { network, currentAccount } = useUnisatConnect();

  return (
    <div className='max-w-6xl mx-auto pt-4'>
      {currentAccount !== '' ? (
        <ItemList />
      ) : (
        <div className='text-xl text-center mt-20'>{t('common.hint_connect')}</div>
      )}
    </div>
  );
}
