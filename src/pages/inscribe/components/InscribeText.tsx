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
import { useTranslation } from 'react-i18next';

interface InscribeTextProps {
  onNext?: () => void;
  onChange?: (type: string, value: string) => void;
}
export const InscribeText = ({ onNext, onChange }: InscribeTextProps) => {
  const { t } = useTranslation();
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
        <p>{t('pages.inscribe.text.single_des')}</p>
        <p>{t('pages.inscribe.text.bulk_des')}</p>
      </div>
      <div className='mb-4'>
        <RadioGroup onChange={(e) => set('type', e)} value={data.type}>
          <Stack direction='row' justify='center' spacing='40px'>
            <Radio value='single'>{t('pages.inscribe.text.single')}</Radio>
            <Radio value='bulk'>{t('pages.inscribe.text.bulk')}</Radio>
          </Stack>
        </RadioGroup>
      </div>
      <div className='mb-2'>
        <FormControl >
          <Textarea
            resize='none'
            rows={5}
            placeholder={t('pages.inscribe.text.textarea_placeholder')}
            value={data.text}
            onChange={(e) => set('text', e.target.value)}
          />
        </FormControl>
      </div>
      <div className='w-full mx-auto'>
        <Button size='md' colorScheme='blue' isDisabled={!data.text} width='100%' onClick={onNext}>
          {t('buttons.next')}
        </Button>
      </div>
    </div>
  );
};
