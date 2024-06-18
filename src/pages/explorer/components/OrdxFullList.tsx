import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getOrdxStatusList, health } from '@/api';
import { useCommonStore } from '@/store';
import { BlockAndTime } from '@/components/BlockAndTime';
import { useNavigate } from 'react-router-dom';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { generateOrdUrl } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { removeObjectEmptyValue } from '../../inscribe/utils';
import { useToast } from '@chakra-ui/react';
import { cacheData, getCachedData } from '@/lib/utils/cache';

interface DataType {
  tick: string;
  block: string;
  rarity: string;
}

export const OrdxFullList = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { btcHeight } = useCommonStore((state) => state);
  const { network, address: currentAccount } = useReactWalletStore();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const list = useMemo(() => data?.data?.detail || [], [data]);
  const total = useMemo(() => data?.data?.total || 10, [data]);
  const height = useMemo(() => {
    return data?.data?.height;
  }, [data]);

  const clickHandler = (item) => {
    nav(`/explorer/${item.tick}`);
  };

  const toInscribe = (e: any, item: any) => {
    e.stopPropagation();
    console.log(item);
    // nav('/inscribe', { state: { type: 'ordx', item } });
  };

  const SatTitle = () => {
    return (
      <a
        className='flex items-center justify-center'
        href='https://docs.ordx.space/ordinalsx/instruct#deploy'
        target='_blank'>
        <span className='mr-1'>{t('common.satAttr')}</span>
        <QuestionCircleOutlined />
      </a>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: t('common.index'),
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center',
    },
    {
      title: t('common.tick'),
      dataIndex: 'tick',
      key: 'tick',
      width: 80,
      align: 'center',
      render: (tick) => {
        return <div className='cursor-pointer'>{tick}</div>;
      },
    },
    {
      title: t('common.content'),
      dataIndex: 'inscriptionId',
      key: 'inscriptionId',
      width: 80,
      align: 'center',
      render: (inscriptionId, record) => {
        return record.contenttype === 'text/html' ? (
          <div>
            <iframe
              scrolling='no'
              sandbox='allow-scripts'
              src={generateOrdUrl({
                network,
                path: `preview/${inscriptionId}`,
              })}
              className='max-w-full'></iframe>
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      key: 'description',
      width: 120,
      align: 'center',
      render: (t) => t || '-',
    },
    {
      title: t('common.block'),
      dataIndex: 'block',
      key: 'block',
      width: 130,
      align: 'center',
      render: (block, record) => {
        return block === '-' ? (
          '-'
        ) : (
          <BlockAndTime
            startBlock={record.startBlock}
            endBlock={record.endBlock}
          />
        );
      },
    },
    {
      title: t('common.limit'),
      dataIndex: 'limit',
      key: 'limit',
      width: 80,
      align: 'center',
    },
    {
      title: t('common.max'),
      dataIndex: 'max',
      key: 'max',
      width: 80,
      align: 'center',
    },
    {
      title: t('common.selfmint'),
      dataIndex: 'selfmint',
      key: 'selfmint',
      width: 80,
      align: 'center',
      render: (selfmint) => {
        return selfmint ? `${selfmint}%` : '-';
      },
    },
    {
      title: SatTitle,
      dataIndex: 'attr',
      key: 'attr',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const { rarity, cn, trz } = record;
        const attrArr: string[] = [];
        if (rarity !== 'unknow' && rarity !== 'common' && !!rarity) {
          attrArr.push(`rar=${rarity}`);
        }
        if (cn !== undefined) {
          attrArr.push(`cn=${cn}`);
        }
        if (trz !== undefined) {
          attrArr.push(`trz=${trz}`);
        }
        let attr = '-';
        if (attrArr.length > 0) {
          attr = attrArr.join(';');
        }
        return attr;
      },
    },
    {
      title: t('common.holders'),
      dataIndex: 'holders',
      key: 'holders',
      width: 60,
      align: 'center',
    },
    {
      title: t('common.minted'),
      dataIndex: 'minted',
      key: 'minted',
      width: 60,
      align: 'center',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 70,
      align: 'center',
      render: (status, record) => {
        if (status === 'Pending') {
          return <Tag color='orange'>{t('common.waiting')}</Tag>;
        } else if (status === 'Minting') {
          return (
            <Button type='link' onClick={(e) => toInscribe(e, record)}>
              {t('common.minting')}
            </Button>
          );
        }
        return (
          <Tag color='blue' className='mr-0'>
            {t('common.completed')}
          </Tag>
        );
      },
    },
  ];

  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
  };

  const dataSource: DataType[] = useMemo(
    () =>
      list.map((item) => {
        const isSpecial =
          item.rarity !== 'unknow' && item.rarity !== 'common' && !!item.rarity;
        let status;
        console.log(item.ticker);
        console.log(isSpecial, item.startBlock, item.endBlock, btcHeight, btcHeight)
        if (!isSpecial && item.startBlock < 0) {
          if (item.max && item.totalMinted < item.max) {
            status = 'Minting';
          } else if (!item.max) {
            status = 'Minting';
          }
        } else if (isSpecial && item.startBlock < 0) {
          if (item.max && item.totalMinted < item.max) {
            status = 'Minting';
          } else if (!item.max) {
            status = 'Minting';
          }
        } else if (
          item.startBlock &&
          item.endBlock &&
          btcHeight <= item.endBlock &&
          btcHeight >= item.startBlock
        ) {
          if (item.max && item.totalMinted < item.max) {
            status = 'Minting';
          } else if (!item.max) {
            status = 'Minting';
          }
        } else if (btcHeight < item.startBlock) {
          status = 'Pending';
        } else {
          status = 'Completed';
        }
        const attrArr: string[] = [];
        if (isSpecial) {
          attrArr.push(`rar=${item.rarity}`);
        }
        if (item.cn) {
          attrArr.push(`cn=${item.cn}`);
        }
        if (item.trz) {
          attrArr.push(`trz=${item.trz}`);
        }
        let attr;
        if (attrArr.length) {
          attr = attrArr.join(';');
        }
        const value = JSON.stringify(
          removeObjectEmptyValue({
            p: 'ordx',
            op: 'deploy',
            tick: item.ticker?.toString(),
            block: item.blockChecked ? item.block?.toString() : undefined,
            lim: item.limit?.toString(),
            attr,
            des: item.description?.toString(),
          }),
        );
        return {
          id: item.id + 1,
          tick: item.ticker,
          block:
            item.startBlock > 0 ? `${item.startBlock}-${item.endBlock}` : '-',
          startBlock: item.startBlock,
          endBlock: item.endBlock,
          rarity: item.rarity,

          description: item.description,
          reg: item.reg,
          content: value,
          holders: item.holdersCount,
          contenttype: item.contenttype,
          inscriptionId: item.inscriptionId,
          deployHeight: item.deployHeight,
          minted: item.totalMinted,
          limit: item.limit,
          max: item.max || '-',
          selfmint: item.selfmint,
          status,
          deploy_time: new Date(item.deployBlocktime).toLocaleString('af'),
        };
      }),
    [list, height],
  );

  const getAllOrdxs = async () => {
    setLoading(true);
    setData({});
    const resp = await getOrdxStatusList({
      start: start,
      limit: limit,
      network: network,
    });
    if (resp.code !== 0) {
      toast({
        title: resp.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    setData(resp);
  };

  useEffect(() => {
    getAllOrdxs();
  }, [network, currentAccount]);

  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      pagination={{
        position: ['bottomCenter'],
        defaultPageSize: 10,
        total: total,
        onChange: paginationChange,
        showSizeChanger: false,
      }}
      scroll={{ x: 1160 }}
      onRow={(record) => {
        return {
          onClick: () => clickHandler(record), // 点击行
        };
      }}
    />
  );
};
