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
import { InscribeType } from '@/types';
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
          Back
        </Button>
        <Button size='md' colorScheme='blue' width='100%' onClick={onNext}>
          Next
        </Button>
      </SimpleGrid>
    </div>
  );
};
