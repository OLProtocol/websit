import {
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Flex,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMap } from 'react-use';
import { InscribeCheckItem } from './InscribeCheckItem';
import { InscribeType } from '@/type';
import { useTranslation } from 'react-i18next';

interface Brc20SetpOneProps {
  list: any[];
  type: InscribeType;
  onNext?: () => void;
  onBack?: () => void;
}
export const InscribeStepTwo = ({
  list,
  type = 'text',
  onNext,
  onBack,
}: Brc20SetpOneProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className='text-lg font-bold text-center'>
        {t('pages.inscribe.step_two.title')}
      </div>
      <div className='text-md text-center text-gray-600'>
        <span className='text-black'>
          {t('pages.inscribe.step_two.des', {
            num: list.length,
            type: type,
          })}
        </span>
      </div>
      <div className='max-h-[30rem] overflow-y-auto'>
        <VStack spacing='10px' className='w-full py-4'>
          {list.map((item, index) => (
            <InscribeCheckItem
              key={index}
              label={index + 1}
              value={item.show}
            />
          ))}
        </VStack>
      </div>
      <SimpleGrid columns={2} spacingX='20px'>
        <Button size='md' colorScheme='green' width='100%' onClick={onBack}>
          {t('buttons.back')}
        </Button>
        <Button size='md' colorScheme='blue' width='100%' onClick={onNext}>
          {t('buttons.next')}
        </Button>
      </SimpleGrid>
    </div>
  );
};
