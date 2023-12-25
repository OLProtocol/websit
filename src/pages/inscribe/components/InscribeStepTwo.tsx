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
interface Brc20SetpOneProps {
  list: any[];
  type: 'text' | 'brc-20';
  onNext?: () => void;
  onBack?: () => void;
}
export const InscribeStepTwo = ({
  list,
  type = 'text',
  onNext,
  onBack,
}: Brc20SetpOneProps) => {
  const [data, { set }] = useMap();
  return (
    <div>
      <div className='text-lg font-bold text-center'>
        Please double check your text below before continuing:
      </div>
      <div className='text-md text-center text-gray-600'>
        You are about to inscribe{' '}
        <span className='text-black'>
          {list.length} {type}
        </span>
        .
      </div>
      <VStack spacing='10px' className='w-full py-4'>
        {
          list.map((item, index) => (
            <InscribeCheckItem key={index} label={index + 1} value={item.value} />
          ))
        }
      </VStack>
      <SimpleGrid columns={2} spacingX='20px'>
        <Button size='md' width='100%' onClick={onBack}>
          Back
        </Button>
        <Button size='md' width='100%' onClick={onNext}>
          Next
        </Button>
      </SimpleGrid>
    </div>
  );
};
