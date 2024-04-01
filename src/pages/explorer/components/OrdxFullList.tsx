import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getOrdxStatusList } from '@/api';
import { useCommonStore } from '@/store';
import { BlockAndTime } from '@/components/BlockAndTime';
import { useNavigate } from 'react-router-dom';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { useTranslation } from 'react-i18next';
import { removeObjectEmptyValue } from '../../inscribe/utils';
import { Card, CardBody, CardHeader, Heading, useToast } from '@chakra-ui/react';
import { cacheData, getCachedData } from '@/lib/utils/cache';

interface DataType {
  tick: string;
  block: string;
  rarity: string;
}

export const Ord2FullList = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { btcHeight } = useCommonStore((state) => state);
  const { network, currentAccount } = useUnisatConnect();
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
    nav('/inscribe', { state: { type: 'ordx', item } });
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
        let status;
        if (item.rarity !== 'unknow' && item.rarity !== 'common' && !!item.rarity) {
          status = 'Minting';
        } else if (
          item.startBlock &&
          item.endBlock &&
          btcHeight < item.endBlock &&
          btcHeight > item.startBlock
        ) {
          status = 'Minting';
        } else if (btcHeight < item.startBlock) {
          status = 'Pending';
        } else {
          status = 'Completed';
        }
        const special = item.rarity !== 'unknow' && item.rarity !== 'common' && !!item.rarity;
        const attrArr: string[] = [];
        if (item.rarity !== 'unknow' && item.rarity !== 'common' && !!item.rarity) {
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
            block: item.blockChecked
              ? item.block?.toString()
              : undefined,
            lim: item.limit?.toString(),
            attr,
            des: item.description?.toString(),
          }),
        );
        return {
          id: item.id+1,
          tick: item.ticker,
          block: !special && item.startBlock > 0 ? `${item.startBlock}-${item.endBlock}` : '-',
          startBlock: item.startBlock,
          endBlock: item.endBlock,
          rarity: item.rarity,
          description: item.description,
          reg: item.reg,
          content: value,
          holders: item.holdersCount,
          deployHeight: item.deployHeight,
          minted: item.totalMinted,
          limit: item.limit,
          status,
          deploy_time: new Date(item.deployBlocktime).toLocaleString('af'),
        };
      }),
    [list, height],
  );

  const getAllOrdxs = async () => {
    setLoading(true);
    const resp = await getOrdxStatusList({
      start: start, 
      limit: limit, 
      network: network
    });
    if (resp.code !== 0) {
      toast({
        title: resp.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return
    }
    setLoading(false);
    setData(resp);
    cacheData('all_ordx_list_' + currentAccount, resp);
  };

  useEffect(() => {
    const cachedData = getCachedData('all_ordx_list_' + currentAccount);
    if (cachedData === null) {
      getAllOrdxs();
    } else {
      setData(cachedData);
    }
    
    // 设置定时器每隔一定时间清除缓存数据
    const intervalId = setInterval(() => {
      cacheData('all_ordx_list_' + currentAccount, null);
    }, 600000); // 每10min清除一次
    return () => clearInterval(intervalId); // 清除定时器
  }, []);

  return (
    // <div className='rounded-3xl p-4 mx-auto bg-gray-200'>
    <div className='flex flex-col max-w-7xl mx-auto pt-8'>
      <Card>
        <CardHeader className='text-center flex justify-between'>
          <Heading size='md'>{t('pages.explorer.list_title')}</Heading>
          <Button onClick={getAllOrdxs}>{t('buttons.fresh')}</Button>
        </CardHeader>
        <CardBody>
          <Table bordered
            columns={columns}
            dataSource={dataSource}
            pagination={{
              position: ['bottomCenter'],
              defaultPageSize: 10,
              total: total,
              onChange: paginationChange,
              showSizeChanger: false,
            }}
            scroll={{ x: 1000 }}
            onRow={(record) => {
              return {
                onClick: () => clickHandler(record), // 点击行
              };
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
