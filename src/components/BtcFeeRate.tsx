import {
  SimpleGrid,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { useState, useMemo, useEffect } from 'react';
import { BtcFeeRateItem } from './BtcFeeRateItem';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useTranslation } from 'react-i18next';

interface BtcFeeRate {
  onChange?: (value: number) => void;
  feeRateData?: any
}
export const BtcFeeRate = ({ onChange, feeRateData }: BtcFeeRate) => {
  const { t } = useTranslation();
  const [type, setType] = useState('Normal');
  const [customValue, setCustomValue] = useState(1);
  const [economyValue, setEconomyValue] = useState(1);
  const [normalValue, setNormalValue] = useState(1);
  const [minFee, setMinFee] = useState(1);
  const [maxFee, setMaxFee] = useState(500);
  const { network } = useReactWalletStore(state => state);
  const clickHandler = (_type: string, value: number) => {
    if (type === _type) {
      return;
    }
    setType(_type);
    onChange?.(value);
  };
  const setRecommendFee = async () => {
    const defaultFee = network === 'testnet' ? 1 : 50;
    setCustomValue(feeRateData?.fastestFee || defaultFee);
    setEconomyValue(feeRateData?.hourFee || defaultFee);
    setNormalValue(feeRateData?.halfHourFee || defaultFee);
    setMinFee(feeRateData?.minimumFee || defaultFee);
    onChange?.(feeRateData?.halfHourFee || defaultFee);
    setType('Normal');
  };
  const list = useMemo(
    () => [
      {
        label: 'Economy',
        name: t('common.economy'),
        value: economyValue,
      },
      {
        label: 'Normal',
        name: t('common.normal'),
        value: normalValue,
      },
      {
        label: 'Custom',
        name: t('common.custom'),
        value: customValue,
      },
    ],
    [economyValue, normalValue, customValue],
  );
  useEffect(() => {
    setRecommendFee();
  }, [feeRateData]);
  useEffect(() => {
    if (type === 'Custom') {
      onChange?.(customValue);
    }
  }, [customValue]);
  return (
    <div>
      <SimpleGrid columns={3} spacingX='20px' className='mb-2'>
        {list.map((item) => (
          <BtcFeeRateItem
            className={
              type === item.label ? ' border-orange-400 bg-transparent' : 'border-zinc-700 bg-transparent'
            }
            key={item.label}
            label={item.name}
            value={item.value}
            onClick={() => clickHandler(item.label, item.value)}
          />
        ))}
      </SimpleGrid>{' '}
      {economyValue > 100 && (
        <div className='text-sm text-orange-400 mb-2'>
          {t('pages.inscribe.fee.high_hint')}
        </div>
      )}
      {type === 'Custom' && (
        <div>
          <Flex>
            <NumberInput
              maxW='100px'
              mr='2rem'
              size='sm'
              value={customValue}
              onChange={(_, e) => setCustomValue(e)}
              min={1}
              max={maxFee}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Slider
              flex='1'
              focusThumbOnChange={false}
              value={customValue}
              min={1}
              max={maxFee}
              direction='rtl'
              onChange={(e) => setCustomValue(e)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb fontSize='sm' boxSize='16px' />
            </Slider>
          </Flex>
        </div>
      )}
    </div>
  );
};
