import { Input, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import indexer from '@/api/indexer';
import { CopyButton } from '@/components/CopyButton';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { hideStr, } from '@/lib/utils';
import {
    Card,
    CardBody,
    useToast,
} from '@chakra-ui/react';
import { generateMempoolUrl } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useNetwork } from '@/lib/wallet';
const { Search } = Input;

export const OrdSatInscriptionList = () => {
    const { t } = useTranslation();
    const nav = useNavigate();
    const { sat } = useParams();
    const [search, setSearch] = useState('');

    const network = useNetwork();
    const router = useNavigate();

    const [start, setStart] = useState(0);
    const [limit, setLimit] = useState(10);

    const toast = useToast();
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);

    const toInscriptionInfo = (inscriptionId) => {
        nav(`/ord/inscription/${inscriptionId}`);
    };

    const columns: ColumnsType<any> = useMemo(() => {
        const defaultColumn: any[] = [
            {
                title: t('common.inscriptionNumber'),
                dataIndex: 'number',
                key: 'number',
                align: 'center',
                render: (t, record) => {
                    return (
                        <div>
                            {t === 9223372036854775807n ? (
                                <span>-</span>
                            ) : (
                                <span
                                    className='text-blue-500 cursor-pointer'
                                    onClick={() => toInscriptionInfo(record.id)}>
                                    #{t}
                                </span>
                            )}
                        </div>

                    );
                },
            },
            {
                title: t('common.inscriptionId'),
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                render: (t) => {
                    const txid = t.replace(/i0$/m, '')
                    const href = generateMempoolUrl({
                        network,
                        path: `tx/${txid}`,
                    });
                    return (
                        <a
                            className='text-blue-500 cursor-pointer'
                            href={href}
                            target='_blank'>
                            {hideStr(t)}
                        </a>
                    );
                },
            },
            {
                title: 'UTXO',
                dataIndex: 'utxo',
                key: 'utxo',
                align: 'center',
                render: (t) => {
                    return (
                        <div className='flex item-center justify-center'>
                            <span
                                className='text-blue-500 cursor-pointer mr-2'
                                onClick={() => router(`/explorer/utxo/${t}`)}>
                                {hideStr(t)}
                            </span>
                            <CopyButton text={t} tooltip='Copy Tick' />
                        </div>
                    );
                },
            },
            {
                title: t('common.amount'),
                dataIndex: 'value',
                key: 'value',
                align: 'center',
            },
            {
                title: t('common.mint_time'),
                dataIndex: 'mintTime',
                key: 'mintTime',
                align: 'center',
                render: (t) => {
                    return (
                        <span>{new Date(t * 1000).toLocaleString('af')}</span>
                    )
                }
            },
            {
                title: t('common.holder'),
                dataIndex: 'address',
                key: 'address',
                align: 'center',
                render: (t) => (
                    <div className='flex item-center justify-center'>
                        <span>
                            {hideStr(t)}
                        </span>&nbsp;&nbsp;
                        <CopyButton text={t} tooltip='Copy Btc Address' />
                    </div>
                ),
            },
            {
                title: t('common.geneses_address'),
                dataIndex: 'genesesAddress',
                key: 'genesesAddress',
                align: 'center',
                render: (t) => {
                    return (
                        <div className='flex item-center justify-center'>
                            <span
                                className='text-blue-500 cursor-pointer mr-2'
                                onClick={() => nav(`/ord/inscriptions/address/${t}`)}>
                                {hideStr(t)}
                            </span>
                            <CopyButton text={t} tooltip='Copy Geneses Address' />
                        </div>
                    );
                },
            },
        ];
        return defaultColumn;
    }, []);

    const dataSource = useMemo(
        () =>
            data?.data?.nfts.map((v) => ({
                // id: v.inscription.id,
                // number: v.inscription.number,
                // utxo: v.utxo,
                // value: v.inscription.value,
                // sat: v.inscription.sat,
                // address: v.inscription.address,
                // genesesAddress: v.inscription.genesesaddress,
                // mintTime: v.inscription.timestamp,

                id: v.inscriptionId,
                sat: v.sat,
                address: v.address,
                utxo: v.utxo,
                mintTime: v.time,
                genesesAddress: v.inscriptionAddress,
                key: v.inscriptionId
            })) || [],
        [data],
    );

    const total = useMemo(() => data?.data?.nfts?.length || 0, [data]);

    const doSearch = () => {
        if (search === '') {
            return;
        }
        getInscriptions(search);
    };

    const getInscriptions = async (sat: string) => {
        setLoading(true);
        const resp = await indexer.nft.getNftListWithSat({
            sat: Number(sat),
            start,
            limit,
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

    const paginationChange = (page: number, pageSize: number) => {
        setStart((page - 1) * pageSize);
        console.log(page, pageSize);
    };

    useEffect(() => {
        if (sat) {
            getInscriptions(sat);
        }
    }, [sat, network, start, limit]);

    return (
        <div className='flex flex-col max-w-7xl mx-auto'>
            <div className='flex justify-center mt-12 mb-12'>
                <Search
                    allowClear
                    placeholder='Sat'
                    size='large'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={doSearch}
                />
            </div>
            <Card>
                <CardBody>
                    <Table
                        bordered
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: 800 }}
                        pagination={{
                            position: ['bottomCenter'],
                            defaultPageSize: 10,
                            total: total,
                            onChange: paginationChange,
                            showSizeChanger: false,
                        }}
                    />
                </CardBody>
            </Card>
        </div>
    );
};
