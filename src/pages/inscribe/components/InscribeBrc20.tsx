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
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMap } from 'react-use';

interface InscribeBrc20Props {
  onNext?: () => void;
}
export const InscribeBrc20 = ({ onNext }: InscribeBrc20Props) => {
  const [data, { set }] = useMap({
    type: 'mint',
    tick: '',
    amount: 1,
    repeatMint: 1,
    limitPerMint: 1,
    totalSupply: 21000000,
  });
  return (
    <div>
      <div className='mb-2'>
        <RadioGroup onChange={(e) => set('type', e)} value={data.type}>
          <Stack direction='row' justify='center'>
            <Radio value='mint'>Mint</Radio>
            <Radio value='deploy'>Deploy</Radio>
            <Radio value='transfer'>Transfer</Radio>
          </Stack>
        </RadioGroup>
      </div>
      <div className='mb-2'>
        <FormControl>
          <FormLabel>Tick</FormLabel>
          <Input
            type='text'
            maxLength={4}
            placeholder='a characters like "abcd"'
            value={data.tick}
            onChange={(e) => set('tick', e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Amount</FormLabel>
          <NumberInput
            value={data.amount}
            onChange={(_, e) => set('amount', e)}
            min={1}
            max={30}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        {data.type === 'deploy' && (
          <>
            <FormControl>
              <FormLabel>Total Supply</FormLabel>
              <NumberInput
                value={data.totalSupply}
                onChange={(_, e) => set('totalSupply', e)}
                min={1}
                max={30}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Limit Per Mint</FormLabel>
              <NumberInput
                value={data.limitPerMint}
                onChange={(_, e) => set('limitPerMint', e)}
                min={1}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </>
        )}
        {data.type === 'mint' && (
          <FormControl>
            <FormLabel>Repeat Mint</FormLabel>
            <Flex>
              <NumberInput
                maxW='100px'
                mr='2rem'
                value={data.repeatMint}
                onChange={(_, e) => set('repeatMint', e)}
                min={1}
                max={1000}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Slider
                flex='1'
                focusThumbOnChange={false}
                value={data.repeatMint}
                min={1}
                max={1000}
                onChange={(e) => set('repeatMint', e)}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize='sm' boxSize='16px' />
              </Slider>
            </Flex>
          </FormControl>
        )}
      </div>
      <div className='w-60 mx-auto'>
        <Button size='md' isDisabled={!data.tick} width='100%' onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
