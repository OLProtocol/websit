import {
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Divider,
  Flex,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip, Upload, Modal, Table } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { Checkbox } from 'antd';
import { BusButton } from '@/components/BusButton';
import { useEffect, useMemo, useState } from 'react';
import { useMap } from 'react-use';
import { fetchTipHeight, calcTimeBetweenBlocks, hideStr } from '@/lib/utils';
import {
  clacTextSize,
  encodeBase64,
  base64ToHex,
  serializeInscriptionId,
} from '../utils';
import { useTranslation } from 'react-i18next';
import { getOrdxInfo, useSatTypes, getUtxoByType } from '@/api';
import toast from 'react-hot-toast';
import { useCommonStore } from '@/store';
import { ColumnsType } from 'antd/es/table';
import { CopyButton } from '@/components/CopyButton';

const { Dragger } = Upload;

interface InscribeOrdxProps {
  onNext?: () => void;
  onChange?: (data: any) => void;
  onUtxoChange?: (data: any) => void;
}
// const satTypeList = [

export const InscribeOrdx = ({
  onNext,
  onChange,
  onUtxoChange,
}: InscribeOrdxProps) => {
  const { currentAccount } = useUnisatConnect();
  const { btcHeight } = useCommonStore((state) => state);
  const { t } = useTranslation();
  const { state } = useLocation();
  const { network } = useUnisatConnect();
  const [time, setTime] = useState({ start: undefined, end: undefined } as any);
  const [data, { set }] = useMap({
    type: 'mint',
    tick: '',
    amount: 1,
    limitPerMint: 10000,
    repeatMint: 1,
    block_start: 0,
    block_end: 0,
    rarity: '',
    cn: 0,
    trz: 0,
    file: '',
    relateInscriptionId: '',
    fileName: '',
    fileType: '',
    blockChecked: true,
    rarityChecked: false,
    cnChecked: false,
    trzChecked: false,
    des: '',
    mintRarity: '',
    sat: 0,
  });
  const { data: satTypeData } = useSatTypes({ network });
  const satTypeList = useMemo(() => {
    return satTypeData?.data || [];
  }, [satTypeData]);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickLoading, setTickLoading] = useState(false);
  const [tickChecked, setTickChecked] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [specialBeyondStatus, setSpecialBeyondStatus] = useState(false);
  const [allowSpecialBeyondStatus, setAllowSpecialBeyondStatus] =
    useState(false);
  const [originFiles, setOriginFiles] = useState<any[]>([]);
  const [utxoList, setUtxoList] = useState<any[]>([]);
  const [selectedUtxo, setSelectedUtxo] = useState('');

  const filesChange: UploadProps['onChange'] = async ({ fileList }) => {
    const originFiles = fileList.map((f) => f.originFileObj);
    // onChange?.(originFiles);
    const file = originFiles[0];
    if (file) {
      const b64 = (await encodeBase64(file as any)) as string;
      const base64 = b64.substring(b64.indexOf('base64,') + 7);
      const hex = base64ToHex(base64);
      set('file', hex);
      set('fileName', file.name);
      if (file.type) {
        set('fileType', file.type);
      }
      setOriginFiles(originFiles);
      setFiles([]);
    }
  };
  const onFilesRemove = async () => {
    set('file', '');
    set('fileName', '');
    set('fileType', '');
  };
  const getOrdxUtxoByType = async (type: string, amount: number) => {
    try {
      const resp = await getUtxoByType({
        address: currentAccount,
        type,
        amount,
        network,
      });
      return resp;
    } catch (error) {
      toast.error(t('toast.system_error'));
      console.error('Failed to fetch ordxUtxo:', error);
      throw error;
    }
  };
  const getOrdXInfo = async (tick: string) => {
    // If there is no data in localStorage, fetch it
    try {
      const key = `${network}_${tick}`;
      const cachedData = localStorage.getItem(key);
      // if (cachedData) {
      //   return JSON.parse(cachedData);
      // }
      const info = await getOrdxInfo({ tick, network });
      if (info) {
        localStorage.setItem(key, JSON.stringify(info));
      }
      return info;
    } catch (error) {
      toast.error(t('toast.system_error'));
      console.error('Failed to fetch ordXInfo:', error);
      throw error;
    }
  };
  const nextHandler = async () => {
    setErrorText('');
    if (!tickChecked) {
      const checkStatus = await checkTick();

      if (!checkStatus) {
        return;
      }
      setTickChecked(true);
    } else {
      onNext?.();
    }
  };
  const checkTick = async (blur: boolean = false) => {
    setErrorText('');
    // const ec = new TextEncoder();
    // const seris = serializeInscriptionId(
    //   'db0c19557a6bd2ffd5830adf04e6bdbebd21c5b2506ff7fea4db2b4666247e90i0',
    //   0,
    // );
    // console.log('seris', seris);
    // console.log('seris', ec.encode(seris));
    let checkStatus = true;
    if (data.tick === undefined || data.tick === '') {
      checkStatus = false;
      return checkStatus;
    }

    const textSize = clacTextSize(data.tick);
    if (textSize < 3 || textSize == 4 || textSize > 32) {
      checkStatus = false;
      setErrorText(t('pages.inscribe.ordx.error_1'));
      return checkStatus;
    }
    try {
      setTickLoading(true);
      const info = await getOrdXInfo(data.tick);
      setTickLoading(false);

      const { rarity, trz, cn, startBlock, endBlock, limit, imgtype, inscriptionId } = info.data || {};
      const isSpecial = rarity !== 'unknow' && rarity !== 'common' && !!rarity;
      let status = 'Completed';
      if (isSpecial) {
        status = 'Minting';
      } else if (
        startBlock &&
        endBlock &&
        btcHeight <= endBlock &&
        btcHeight >= startBlock
      ) {
        status = 'Minting';
      } else if (btcHeight < startBlock) {
        status = 'Pending';
      } else {
        status = 'Completed';
      }
      if (data.type === 'mint') {
        if (!info.data) {
          checkStatus = false;
          setErrorText(t('pages.inscribe.ordx.error_4', { tick: data.tick }));
          return checkStatus;
        }
        if (status === 'Pending') {
          checkStatus = false;
          setErrorText(t('pages.inscribe.ordx.error_6', { tick: data.tick }));
          return checkStatus;
        }

        if (status === 'Completed') {
          checkStatus = false;
          setErrorText(t('pages.inscribe.ordx.error_7', { tick: data.tick }));
          return checkStatus;
        }
        if (data.amount > info.data.limit) {
          checkStatus = false;
          setErrorText(
            t('pages.inscribe.ordx.error_5', { limit: info.data.limit }),
          );
          return checkStatus;
        }
        if (blur) {
          set('amount', Number(limit));
          set('mintRarity', rarity);
        } else if (isSpecial) {
          const resp = await getOrdxUtxoByType(rarity, 1);
          if (resp.code !== 0) {
            checkStatus = false;
            setErrorText(resp.msg);
            return checkStatus;
          }
          if (imgtype) {
            set('relateInscriptionId', inscriptionId);
          }
          if (!resp?.data.length) {
            checkStatus = false;
            setErrorText(`${rarity}类型的特殊聪数量不够`);
            return checkStatus;
          }

          
          resp.data = resp.data.sort(
            (a, b) =>
              b.sats?.reduce((acc, cur) => {
                return acc + cur.size;
              }, 0) -
              a.sats?.reduce((acc, cur) => {
                return acc + cur.size;
              }, 0),
          );

          setUtxoList(resp.data);
          set('rarity', rarity);
          checkStatus = true;
          return checkStatus;
        }
        // if (isSpecial) {
        //   checkStatus = false;
        //   setErrorText(t('pages.inscribe.ordx.error_8', { tick: data.tick }));
        //   return checkStatus;
        // }
      } else {
        if (info.data) {
          checkStatus = false;
          setErrorText(t('pages.inscribe.ordx.error_3', { tick: data.tick }));
          return checkStatus;
        }
      }
    } catch (error) {
      setTickLoading(true);
      checkStatus = false;
      console.log('error', error);
      return checkStatus;
    }
    return checkStatus;
  };

  const rarityChange = (value: string) => {
    set('rarity', value);
    if (value !== 'common' || !value) {
      set('limitPerMint', 1);
    } else {
      set('limitPerMint', 10000);
    }
  };
  const onBlockChecked = (e: any) => {
    set('blockChecked', e.target.checked);
    set('rarityChecked', !e.target.checked);
    set('cnChecked', !e.target.checked);
    set('trzChecked', !e.target.checked);
  };
  const onRarityChecked = (e: any) => {
    set('rarityChecked', e.target.checked);
    if (e.target.checked) {
      set('blockChecked', false);
    } else {
      set('blockChecked', !data.cnChecked && !data.trzChecked);
    }
  };
  const onCnChecked = (e: any) => {
    set('cnChecked', e.target.checked);
    if (e.target.checked) {
      set('blockChecked', false);
    } else {
      set('blockChecked', !data.rarityChecked && !data.trzChecked);
    }
  };
  const onTrzChecked = (e: any) => {
    set('trzChecked', e.target.checked);
    if (e.target.checked) {
      set('blockChecked', false);
    } else {
      set('blockChecked', !data.rarityChecked && !data.cnChecked);
    }
  };

  const showSat = useMemo(() => {
    return (
      data.mintRarity !== 'common' &&
      data.mintRarity !== 'unknow' &&
      data.mintRarity
    );
  }, [data.mintRarity]);

  const buttonDisabled = useMemo(() => {
    return !data.tick;
  }, [data]);

  // const time = useBlockHeightTime({
  //   height: btcHeight,
  //   start: data.block_start,
  //   end: data.block_end,
  //   network,
  // });
  const onBlockBLur = async () => {
    const res = await calcTimeBetweenBlocks({
      height: btcHeight,
      start: data.block_start,
      end: data.block_end,
      network,
    });
    setTime(res);
  };

  const handleUtxoChange = (utxo: any) => {
    console.log(utxo.utxo);
    if (utxo.offset >= 546) {
      toast.error('请先拆分，再铸造。');
      return;
    }
    setSelectedUtxo(utxo.utxo);

    const satData = utxoList.filter((item) => item.utxo === utxo.utxo)[0];
    satData.sats = satData.sats.sort((a, b) => {
      return b.size - a.size;
    });
    set('sat', satData?.sats?.[0].start);
    if (satData) {
      onUtxoChange?.(satData);
      if (satData.amount > data.amount) {
        if (!allowSpecialBeyondStatus) {
          Modal.confirm({
            centered: true,
            content: `找到的Utxo包含的特殊聪数量(${satData.amount})超过了您输入的Amount值，超出部分可能会被当成Gas消耗掉`,
            okText: '继续',
            cancelText: '取消',
            onOk() {
              setAllowSpecialBeyondStatus(true);
              setTickChecked(true);
            },
          });
        }
      }
    }
  };

  const utxoColumns: ColumnsType<any> = [
    {
      title: '',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (t) => {
        return (
          <div className='flex item-center justify-center'>
            <input
              type='radio'
              id={t.utxo}
              name='utxo-select'
              value={t.utxo}
              checked={selectedUtxo === t.utxo}
              onChange={() => handleUtxoChange(t)}
            />
          </div>
        );
      },
    },
    {
      title: 'Utxo',
      dataIndex: 'utxo',
      key: 'utxo',
      align: 'center',
      width: '40%',
      render: (t) => {
        const txid = t.replace(/:0$/m, '');
        const href =
          network === 'testnet'
            ? `https://mempool.space/testnet/tx/${txid}`
            : `https://mempool.space/tx/${txid}`;
        return (
          <div className='flex item-center justify-center'>
            <Tooltip title={t}>
              <a
                className='text-blue-500 cursor-pointer mr-2'
                href={href}
                target='_blank'>
                {hideStr(t)}
              </a>
            </Tooltip>
            <CopyButton text={t} tooltip='Copy Tick' />
          </div>
        );
      },
    },
    {
      title: 'Sats',
      dataIndex: 'value',
      key: 'value',
      align: 'center',
      render: (r) => {
        return <div className='cursor-pointer'>{r}</div>;
      },
    },
    {
      title: 'Rare Sats',
      key: 'rareSatSize',
      align: 'center',
      render: (r) => {
        let size = 0;
        if (r !== undefined) {
          size = r.sats.reduce((acc, cur) => {
            return acc + cur.size;
          }, 0);
        }
        return <div className='cursor-pointer'>{size}</div>;
      },
    },
    {
      title: 'Offset',
      key: 'offset',
      align: 'center',
      render: (r) => {
        let offset = 0;
        if (r !== undefined) {
          offset = r.sats[0].offset;
        }
        return <div className='cursor-pointer'>{offset}</div>;
      },
    },
  ];

  useEffect(() => {
    if (state?.type === 'ordx') {
      const { item } = state;
      set('type', 'mint');
      set('tick', item.tick);
      set('amount', item.limit);
      set('mintRarity', item.rarity);
    }
  }, [state]);
  useEffect(() => {
    if (btcHeight) {
      set('block_start', btcHeight);
      set('block_end', btcHeight + 4320);
    }
  }, [btcHeight]);
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
            <Radio value='mint'>{t('common.mint')}</Radio>
            <Radio value='deploy'>{t('common.deploy')}</Radio>
          </Stack>
        </RadioGroup>
      </div>
      {errorText && (
        <div className='mb-2 text-xl text-center text-red-500'>{errorText}</div>
      )}

      <div className='mb-4'>
        <FormControl>
          <div className='flex items-center mb-4'>
            <FormLabel className='w-52' marginBottom={0}>
              {t('common.tick')}
            </FormLabel>
            <div className='flex-1'>
              <Input
                type='text'
                onBlur={() => checkTick(true)}
                maxLength={32}
                placeholder={t('pages.inscribe.ordx.tick_placeholder')}
                value={data.tick}
                onChange={(e) => set('tick', e.target.value)}
              />
            </div>
          </div>
        </FormControl>
        {data.type !== 'deploy' && (
          <FormControl>
            <div className='flex items-center  mb-4'>
              <FormLabel className='w-52' marginBottom={0}>
                {t('common.amount')}
              </FormLabel>
              <div className='flex-1'>
                <NumberInput
                  value={data.amount}
                  isDisabled={tickLoading}
                  onChange={(_, e) => set('amount', isNaN(e) ? 0 : e)}
                  min={1}>
                  <NumberInputField />
                </NumberInput>
              </div>
            </div>
            {tickChecked && utxoList.length > 0 && (
              <Table
                bordered
                columns={utxoColumns}
                dataSource={utxoList}
                pagination={false}
              />
            )}
          </FormControl>
        )}

        {data.type === 'deploy' && (
          <>
            <FormControl>
              <div className='flex items-center mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.block')}
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    checked={data.blockChecked}
                    onChange={onBlockChecked}></Checkbox>
                  <div className='ml-2 flex-1 flex items-center'>
                    <NumberInput
                      value={data.block_start}
                      className='flex-1'
                      onBlur={onBlockBLur}
                      isDisabled={!data.blockChecked}
                      placeholder='Block start'
                      onChange={(_, e) => set('block_start', isNaN(e) ? 0 : e)}
                      min={1}>
                      <NumberInputField />
                    </NumberInput>
                    <Divider mx='2' width='3rem' />
                    <NumberInput
                      value={data.block_end}
                      isDisabled={!data.blockChecked}
                      className='flex-1'
                      onBlur={onBlockBLur}
                      placeholder='Block End'
                      onChange={(_, e) => set('block_end', isNaN(e) ? 0 : e)}
                      min={1}>
                      <NumberInputField />
                    </NumberInput>
                  </div>
                </div>
              </div>
            </FormControl>
            {time.start && time.end && (
              <div className='ml-60 mb-2 text-xs text-gray-600'>
                {t('pages.inscribe.ordx.block_helper', {
                  start: time.start,
                  end: time.end,
                })}
              </div>
            )}

            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.rarity')}
                  <Tooltip title={t('pages.inscribe.ordx.rarity_helper')}>
                    <span className='text-blue-500'>
                      (sat
                      <QuestionCircleOutlined />)
                    </span>
                  </Tooltip>
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    checked={data.rarityChecked}
                    onChange={onRarityChecked}></Checkbox>
                  <div className='ml-2 flex-1'>
                    <Select
                      disabled={!data.rarityChecked}
                      placeholder={t('common.select_option')}
                      value={data.rarity}
                      onChange={(e) => rarityChange(e.target.value)}>
                      {satTypeList.map((item) => {
                        return <option value={item}>{item}</option>;
                      })}
                    </Select>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.cn')}
                  <Tooltip title={t('pages.inscribe.ordx.cn_placeholder')}>
                    <span className='text-blue-500'>
                      (sat
                      <QuestionCircleOutlined />)
                    </span>
                  </Tooltip>
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    checked={data.cnChecked}
                    onChange={onCnChecked}></Checkbox>
                  <div className='ml-2 flex-1'>
                    <NumberInput
                      value={data.cn}
                      isDisabled={!data.cnChecked}
                      placeholder={t('pages.inscribe.ordx.cn_placeholder')}
                      onChange={(_, e) => set('cn', isNaN(e) ? 0 : e)}
                      min={0}>
                      <NumberInputField />
                    </NumberInput>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.trz')}
                  <Tooltip title={t('pages.inscribe.ordx.trz_placeholder')}>
                    <span className='text-blue-500'>
                      (sat
                      <QuestionCircleOutlined />)
                    </span>
                  </Tooltip>
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    checked={data.trzChecked}
                    onChange={onTrzChecked}></Checkbox>
                  <div className='ml-2 flex-1'>
                    <NumberInput
                      value={data.trz}
                      placeholder={t('pages.inscribe.ordx.trz_placeholder')}
                      isDisabled={!data.trzChecked}
                      onChange={(_, e) => set('trz', isNaN(e) ? 0 : e)}
                      min={0}>
                      <NumberInputField />
                    </NumberInput>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.limit_per_mint')}
                </FormLabel>
                <div className='flex-1'>
                  <NumberInput
                    value={data.limitPerMint}
                    onChange={(_, e) => set('limitPerMint', isNaN(e) ? 0 : e)}
                    min={1}>
                    <NumberInputField />
                  </NumberInput>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.description')}
                </FormLabel>
                <div className='flex-1'>
                  <Input
                    type='text'
                    maxLength={128}
                    value={data.des}
                    onChange={(e) => set('des', e.target.value)}
                  />
                </div>
              </div>
            </FormControl>
          </>
        )}
        {/* {data.type === 'mint' && showSat && (
          <FormControl>
            <div className='flex items-center  mb-4'>
              <FormLabel className='w-52' marginBottom={0}>
                Sat
              </FormLabel>
              <div className='flex-1'>
                <NumberInput
                  value={data.sat}
                  isDisabled={tickLoading}
                  onChange={(_, e) => set('sat', e)}
                  min={1}>
                  <NumberInputField />
                </NumberInput>
              </div>
            </div>
          </FormControl>
        )} */}
        {data.type === 'deploy' && !data.blockChecked && (
          <FormControl>
            <div className='flex items-center  mb-4'>
              <FormLabel className='w-52' marginBottom={0}>
                Image
              </FormLabel>
              <div className='flex-1'>
                <Dragger
                  accept='image/*'
                  maxCount={1}
                  onRemove={onFilesRemove}
                  listType='picture'
                  beforeUpload={() => false}
                  onChange={filesChange}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>
                    {t('pages.inscribe.files.upload_des_1')}
                  </p>
                  <p className='ant-upload-hint'>
                    {t('pages.inscribe.files.upload_des_2')}
                  </p>
                </Dragger>
              </div>
            </div>
          </FormControl>
        )}
        {data.type === 'mint' && tickChecked && !showSat && (
          <FormControl>
            <div className='flex items-center mb-4'>
              <FormLabel className='w-52' marginBottom={0}>
                {t('common.repeat_mint')}
              </FormLabel>
              <div className='flex-1'>
                <Flex>
                  <NumberInput
                    maxW='100px'
                    mr='2rem'
                    value={data.repeatMint}
                    onChange={(_, e) =>
                      set('repeatMint', isNaN(e) ? 0 : Math.min(e, 10))
                    }
                    min={1}
                    max={10}>
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
                    max={10}
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
        <BusButton>
          <Button
            size='large'
            loading={loading}
            disabled={buttonDisabled}
            type='primary'
            className='w-60'
            onClick={nextHandler}>
            {tickChecked ? t('buttons.next') : 'Check'}
          </Button>
        </BusButton>
      </div>
    </div>
  );
};
