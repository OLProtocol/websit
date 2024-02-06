import { Divider } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface FeeShowProps {
  inscriptionSize?: number;
  feeRate?: number;
  serviceFee?: number;
  serviceStatus?: number;
  totalFee?: number;
  networkFee?: number;
  filesLength?: number;
}
export const FeeShow = ({
  inscriptionSize,
  feeRate,
  serviceFee,
  totalFee,
  serviceStatus,
  networkFee,
  filesLength,
}: FeeShowProps) => {
  console.log(serviceStatus);
  const { t } = useTranslation();
  const { VITE_TIP_HEIGHT } = import.meta.env;
  const serviceText = useMemo(() => {
    const oneFee = inscriptionSize
      ? Math.max(
          Number(import.meta.env.VITE_TIP_MIN),
          Math.ceil(inscriptionSize * 0.1),
        )
      : 0;
    let text = `${oneFee} x ${filesLength} = ${serviceFee}`;
    if (serviceStatus != 1) {
      text += `,  推广期免费。`;
    }
    return text;
  }, [inscriptionSize, serviceFee, filesLength, serviceStatus]);
  return (
    <div>
      {feeRate && (
        <>
          <div className='flex justify-between'>
            <div>{t('pages.inscribe.fee.fee_rate')}</div>
            <div>
              <span>{feeRate}</span> <span> sats/vB</span>
            </div>
          </div>
          <Divider style={{ margin: '10px 0' }} />
        </>
      )}
      <div className='flex justify-between mb-2'>
        <div>{t('pages.inscribe.fee.inscription_size')}</div>
        <div>
          <span>
            {filesLength} x {inscriptionSize}
          </span>{' '}
          <span> sats</span>
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
          <span className='text-blue-400'>({serviceText})</span>
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
