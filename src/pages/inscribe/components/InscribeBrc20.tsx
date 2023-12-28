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
import { useEffect, useState } from 'react';
import { useMap } from 'react-use';
import { clacTextSize } from '../utils';

interface InscribeBrc20Props {
  onNext?: () => void;
  onChange?: (data: any) => void;
}
export const InscribeBrc20 = ({ onNext, onChange }: InscribeBrc20Props) => {
  const [data, { set }] = useMap({
    type: 'mint',
    tick: '',
    amount: 1,
    repeatMint: 1,
    limitPerMint: 1,
    totalSupply: 21000000,
  });
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const nextHandler = async () => {
    setErrorText('');
    const textSize = clacTextSize(data.tick);
    console.log('textSize', textSize);
    console.log(textSize < 4);
    if (textSize < 4) {
      setErrorText('Tick must be 4 byte long');
      return;
    }
    setLoading(true);
    onNext?.();
    // const info = await fetchBrc20Info();

    // if (info.error === 'no ticker info' && data.type === 'deploy') {
    //   setErrorText(`${data.tick} has been deployed`);
    //   return;
    // }
    // if (data.type === 'mint') {
    //   console.log(data.type);
    //   console.log(data.amount);
    //   if (data.amount > (info.limit || 1000)) {
    //     setErrorText(`Mint amount must be less than ${info.limit} Tick`);
    //   }
    // }
    setLoading(false);
  };
  const fetchBrc20Info = async () => {
    const res = await fetch(
      `http://192.168.1.111:8001/v1/brc20/get_tickinfo/${data.tick}/info`,
    );
    const json = await res.json();
    return json;
  };
  useEffect(() => {
    onChange?.(data);
  }, [data]);
  return (
    <div>
      <div className='mb-4'>
        <RadioGroup
          size='lg'
          onChange={(e) => set('type', e)}
          value={data.type}>
          <Stack direction='row' justify='center' spacing='20px'>
            <Radio value='mint'>Mint</Radio>
            <Radio value='deploy'>Deploy</Radio>
            <Radio value='transfer'>Transfer</Radio>
          </Stack>
        </RadioGroup>
      </div>
      {errorText && (
        <div className='mb-2 text-md text-center text-red-500'>{errorText}</div>
      )}

      <div className='mb-2'>
        <FormControl>
          <div className='flex items-center mb-4'>
            <FormLabel className='w-40' marginBottom={0}>
              Tick
            </FormLabel>
            <div className='flex-1'>
              <Input
                type='text'
                maxLength={4}
                placeholder='a characters like "abcd"'
                value={data.tick}
                onChange={(e) => set('tick', e.target.value)}
              />
            </div>
          </div>
        </FormControl>
        {data.type !== 'deploy' && (
          <FormControl>
            <div className='flex items-center mb-4'>
              <FormLabel className='w-40' marginBottom={0}>
                Amount
              </FormLabel>
              <div className='flex-1'>
                <NumberInput
                  value={data.amount}
                  onChange={(_, e) => set('amount', e)}
                  min={1}>
                  <NumberInputField />
                </NumberInput>
              </div>
            </div>
          </FormControl>
        )}

        {data.type === 'deploy' && (
          <>
            <FormControl>
              <div className='flex items-center mb-4'>
                <FormLabel className='w-40' marginBottom={0}>
                  Total Supply
                </FormLabel>
                <div className='flex-1'>
                  <NumberInput
                    value={data.totalSupply}
                    onChange={(_, e) => set('totalSupply', e)}
                    min={1}
                    max={30}>
                    <NumberInputField />
                  </NumberInput>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center mb-4'>
                <FormLabel className='w-40' marginBottom={0}>
                  Limit Per Mint
                </FormLabel>
                <div className='flex-1'>
                  <NumberInput
                    value={data.limitPerMint}
                    onChange={(_, e) => set('limitPerMint', e)}
                    min={1}>
                    <NumberInputField />
                  </NumberInput>
                </div>
              </div>
            </FormControl>
          </>
        )}
        {data.type === 'mint' && (
          <FormControl>
            <div className='flex items-center mb-4'>
              <FormLabel className='w-40' marginBottom={0}>
                Repeat Mint
              </FormLabel>
              <div className='flex-1'>
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
              </div>
            </div>
          </FormControl>
        )}
      </div>
      <div className='w-60 mx-auto'>
        <Button
          size='md'
          colorScheme='blue'
          isLoading={loading}
          isDisabled={!data.tick}
          width='100%'
          onClick={nextHandler}>
          Next
        </Button>
      </div>
    </div>
  );
};
