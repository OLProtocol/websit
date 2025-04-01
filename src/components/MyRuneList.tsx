import { useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { generateMempoolUrl, genOrdinalsUrl, hideStr } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/CopyButton';
import { useToast } from '@chakra-ui/react';
import indexer from '@/api/indexer';
import { DisplayAsset, TickerInfo, TickerRespV3 } from '@/api/type';

interface RuneListProps {
  baseRuneSummary: DisplayAsset[];
  
}
export const MyRuneList = ({ baseRuneSummary }: RuneListProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { network, } = useReactWalletStore();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [runelist, setRunelist] = useState<TickerInfo[]>([]);

  useEffect(() => {
    const fetchRunelist = async () => {
      setLoading(true);
      const ret: TickerInfo[]  = []
      try {
        for (const runeSummary of baseRuneSummary) {
          const runeInfo = await getRune(runeSummary.Name.Ticker)
          if (runeInfo) {
            ret.push(runeInfo);
          }
        }
      }finally {
        setLoading(false);
      }
      setRunelist(ret);
    };
    fetchRunelist();
  }, [baseRuneSummary]);

  const getRune = async (ticker: string) => {
    const param = { Protocol: "runes", Type: "f", Ticker: ticker }
    let data: TickerRespV3 | null = null
    try {
      data = await indexer.runes.getRune(param)
      if (data?.code !== 0) {
        toast({
          title: t('common.error'),
          description: data.msg,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return null
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null
    }

    return data?.data
  };

  const clickHandler = (item:TickerInfo) => {
    const rune = `${item.name.Protocol}:${item.name.Type}:${item.name.Ticker}`;
    nav(`/explorer/rune/${rune}`);
  };

  const columns: ColumnsType<any> = [
    // {
    //   title: t('common.index'),
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: 80,
    //   align: 'center',
    // },
    {
      title: t('runes.id'),
      dataIndex: 'id',
      key: 'id',
      width: 10,
      align: 'center',
      render: (id) => {
        return <div className='cursor-pointer'>{id}</div>;
      },
    },
    {
      title: t('runes.name'),
      dataIndex: 'displayname',
      key: 'displayname',
      width: 180,
      align: 'center',
      render: (displayname) => {
        return <div className='cursor-pointer'>{displayname}</div>;
      },
    },
    // {
    //   title: t('runes.ticker'),
    //   dataIndex: 'name',
    //   key: 'name',
    //   width: 20,
    //   align: 'center',
    //   render: (name) => {
    //     return <div className='cursor-pointer'>{name.Ticker}</div>;
    //   },
    // },
    // {
    //   title: t('runes.divisibility'),
    //   dataIndex: 'divisibility',
    //   key: 'divisibility',
    //   width: 20,
    //   align: 'center',
    //   render: (divisibility) => {
    //     return <div className='cursor-pointer'>{divisibility}</div>;
    //   },
    // },
    {
      title: t('runes.deployHeight'),
      dataIndex: 'deployHeight',
      key: 'deployHeight',
      width: 90,
      align: 'center',
      render: (deployHeight) => {
        return <div className='cursor-pointer'>{deployHeight}</div>;
      },
    },
    {
      title: t('runes.deployBlockTime'),
      dataIndex: 'deployBlockTime',
      key: 'deployBlockTime',
      width: 140,
      align: 'center',
      render: (deployBlockTime) => {
        const date = new Date(deployBlockTime * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        return <div className='cursor-pointer'>{`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</div>;
      },
    },
    {
      title: t('runes.deployTx'),
      dataIndex: 'deployTx',
      key: 'deployTx',
      width: 20,
      align: 'center',
      render: (deployTx) => {
        // return <div className='cursor-pointer'>{deployTx}</div>;

        return (
          <div className='flex item-center justify-center'>
            <span
              className='text-blue-500 cursor-pointer mr-2'
              onClick={(e) => {
                e.stopPropagation();
                const url = generateMempoolUrl({network: network, path: `tx/${deployTx}` });
                window.open(url, '_blank');1
              }}>
              {hideStr(deployTx)}
            </span>
            <CopyButton text={deployTx} tooltip='Copy' />
          </div>
        );
      },
    },
    // {
    //   title: t('runes.limit'),
    //   dataIndex: 'limit',
    //   key: 'limit',
    //   width: 20,
    //   align: 'center',
    //   render: (limit) => {
    //     return <div className='cursor-pointer'>{limit}</div>;
    //   },
    // },
    // {
    //   title: t('runes.n'),
    //   dataIndex: 'n',
    //   key: 'n',
    //   width: 20,
    //   align: 'center',
    //   render: (n) => {
    //     return <div className='cursor-pointer'>{n}</div>;
    //   },
    // },
    // {
    //   title: t('runes.totalMinted'),
    //   dataIndex: 'totalMinted',
    //   key: 'totalMinted',
    //   width: 20,
    //   align: 'center',
    //   render: (totalMinted) => {
    //     return <div className='cursor-pointer'>{totalMinted}</div>;
    //   },
    // },
    // {
    //   title: t('runes.mintTimes'),
    //   dataIndex: 'mintTimes',
    //   key: 'mintTimes',
    //   width: 20,
    //   align: 'center',
    //   render: (mintTimes) => {
    //     return <div className='cursor-pointer'>{mintTimes}</div>;
    //   },
    // },
    // {
    //   title: t('runes.maxSupply'),
    //   dataIndex: 'maxSupply',
    //   key: 'maxSupply',
    //   width: 20,
    //   align: 'center',
    //   render: (maxSupply) => {
    //     return <div className='cursor-pointer'>{maxSupply}</div>;
    //   },
    // },
    {
      title: t('runes.holdersCount'),
      dataIndex: 'holdersCount',
      key: 'holdersCount',
      width: 100,
      align: 'center',
      render: (holdersCount) => {
        return <div className='cursor-pointer'>{holdersCount}</div>;
      },
    },

  ];

  const dataSource: any[] = useMemo(
    () => {
      return runelist.map((item,i) => {
        return {
          key: i + 1,
          index: i + 1,
          ...item,
        };
      })
    },
    [runelist],
  );

  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
  };

  return (
    <Table
      bordered
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={{
        position: ['bottomCenter'],
        defaultPageSize: 10,
        total: runelist.length,
        onChange: paginationChange,
        showSizeChanger: false,
      }}
      scroll={{ x: 1000 }}
      onRow={(record:TickerInfo) => {
        return {

          onClick: () => clickHandler(record), // 点击行
        };
      }}
    />
  );
};
