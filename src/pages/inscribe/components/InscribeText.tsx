import {
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useMap } from 'react-use';

interface InscribeBrc20Props {
  onNext?: () => void;
  onChange?: (type: string, value: string) => void;
}
export const InscribeText = ({ onNext, onChange }: InscribeBrc20Props) => {
  const [data, { set }] = useMap({
    type: 'single',
    text: '',
  });
  useEffect(() => {
    onChange?.(data.type, data.text);
  }, [data.type, data.text]);

  return (
    <div>
      <div className='mb-4 text-center'>
        <p>If single, we will inscribe exactly what is there</p>
        <p>If bulk, we will inscribe one for every new line.</p>
      </div>
      <div className='mb-4'>
        <RadioGroup onChange={(e) => set('type', e)} value={data.type}>
          <Stack direction='row' justify='center' spacing='40px'>
            <Radio value='single'>Single</Radio>
            <Radio value='bulk'>Bulk</Radio>
          </Stack>
        </RadioGroup>
      </div>
      <div className='mb-2'>
        <FormControl>
          <Textarea
            resize='none'
            rows={5}
            placeholder='any text here'
            value={data.text}
            onChange={(e) => set('text', e.target.value)}
          />
        </FormControl>
      </div>
      <div className='w-full mx-auto'>
        <Button size='md' colorScheme='blue' isDisabled={!data.text} width='100%' onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
