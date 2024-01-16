import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';

interface FeeShowProps {
  inscriptionSize?: number;
  feeRate?: number;
  serviceFee?: number;
  totalFee?: number;
  networkFee?: number;
}
export const FeeShow = ({
  inscriptionSize,
  feeRate,
  serviceFee,
  totalFee,
  networkFee,
}: FeeShowProps) => {
  const { t } = useTranslation();
  return (
    <div>
      {feeRate && (
        <>
          <div className='flex justify-between'>
            <div>{t('pages.inscribe.fee.fee_rate')}</div>
            <div>
              <span>{feeRate}</span> <span> sate/vB</span>
            </div>
          </div>
          <Divider style={{ margin: '10px 0' }} />
        </>
      )}
      <div className='flex justify-between mb-2'>
        <div>{t('pages.inscribe.fee.inscription_size')}</div>
        <div>
          <span>{inscriptionSize}</span> <span> sate</span>
        </div>
      </div>
      <div className='flex justify-between'>
        <div>{t('pages.inscribe.fee.network_fee')}</div>
        <div>
          <span>{networkFee}</span> <span> sats</span>
        </div>
      </div>
      <Divider style={{ margin: '10px 0' }} />
      <div className='flex justify-between mb-2'>
        <div>
          {t('pages.inscribe.fee.service_fee')}
          <span className='text-blue-400'>
            (1%, {t('pages.inscribe.fee.service_hint', { max: 1000 })})
          </span>
        </div>
        <div>
          <span>{serviceFee}</span> <span> sats</span>
        </div>
      </div>
      <div className='flex justify-between'>
        <div>{t('pages.inscribe.fee.total_fee')}</div>
        <div>
          <span>{totalFee}</span> <span> sats</span>
        </div>
      </div>
    </div>
  );
};
