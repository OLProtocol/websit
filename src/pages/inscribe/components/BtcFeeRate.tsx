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
import { useUnisatConnect } from '@/lib/hooks/unisat';
interface BtcFeeRate {
  onChange?: (value: number) => void;
}
export const BtcFeeRate = ({ onChange }: BtcFeeRate) => {
  const [type, setType] = useState('');
  const [preValue, setPreValue] = useState(0);
  const [customValue, setCustomValue] = useState(0);
  const [economyValue, setEconomyValue] = useState(0);
  const [normalValue, setNormalValue] = useState(0);
  const [minFee, setMinFee] = useState(1);
  const [maxFee, setMaxFee] = useState(500);
  const { network } = useUnisatConnect();
  const clickHandler = (type: string, value: number) => {
    setType(type);
    setPreValue(value);
    if (value !== preValue) {
      onChange?.(value);
    }
  };
  const getRecommendFee = async () => {
    const res = await fetch(
      `https://mempool.space/${network}/api/v1/fees/recommended`,
    ).then((res) => res.json());
    setCustomValue(res.fastestFee);
    setEconomyValue(res.hourFee);
    setNormalValue(res.halfHourFee);
    setMinFee(res.minimumFee);
    setType('Normal');
    onChange?.(res.halfHourFee);
  };
  const list = useMemo(
    () => [
      {
        label: 'Economy',
        value: economyValue,
      },
      {
        label: 'Normal',
        value: normalValue,
      },
      {
        label: 'Custom',
        value: customValue,
      },
    ],
    [economyValue, normalValue, customValue],
  );
  useEffect(() => {
    getRecommendFee();
  }, []);
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
              type === item.label ? ' border-orange-400 ' : 'border-gray-500'
            }
            key={item.label}
            label={item.label}
            value={item.value}
            onClick={() => clickHandler(item.label, item.value)}
          />
        ))}
      </SimpleGrid>
      <div className='text-sm text-orange-400 mb-2'>
        The current Bitcoin network is highly congested. please be patient and
        wait.
      </div>
      {type === 'Custom' && (
        <div>
          <Flex>
            <NumberInput
              maxW='100px'
              mr='2rem'
              size='sm'
              value={customValue}
              onChange={(_, e) => setCustomValue(e)}
              min={minFee}
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
              min={minFee}
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
