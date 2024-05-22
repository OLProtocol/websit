import { Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getOrdInscriptionsByAddress } from '@/api';
import { CopyButton } from '@/components/CopyButton';
import { useReactWalletStore } from 'btc-connect/dist/react';

import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { hideStr, } from '@/lib/utils';
import {
    Card,
    CardBody,
    useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const NftList = () => {
    const { t } = useTranslation();
    const nav = useNavigate();

    const { network, address } = useReactWalletStore();
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
                    const href =
                        network === 'testnet'
                            ? `https://mempool.space/testnet/tx/${txid}`
                            : `https://mempool.space/tx/${txid}`;
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
                title: 'Sat',
                dataIndex: 'sat',
                key: 'sat',
                align: 'center',
                render: (t) => {
                    return (
                        <div className='flex item-center justify-center'>
                            <span
                                className='text-blue-500 cursor-pointer mr-2'
                                onClick={() => nav(`/ord/inscriptions/sat/${t}`)}>
                                {t}
                            </span>
                            <CopyButton text={t} tooltip='Copy Tick' />
                        </div>
                    );
                },
            },
            {
                title: t('common.mint_time'),
                dataIndex: 'mintTime',
                key: 'mintTime',
                align: 'center',
                render: (t) => {
                    return (
                        <span>{new Date(t).toLocaleString('af')}</span>
                    )
                }
            },
            {
                title: t('common.geneses_address'),
                dataIndex: 'genesesAddress',
                key: 'genesesAddress',
                align: 'center',
                render: (t) => {
                    return (
                        <a
                            className='text-blue-500 cursor-pointer'
                            onClick={() => nav(`/ord/inscriptions/address/${t}`)}>
                            {hideStr(t)}
                        </a>
                    );
                },
            },
        ];
        return defaultColumn;
    }, []);

    const dataSource = useMemo(
        () =>
            data?.data?.detail.map((v) => ({
                id: v.inscription.id,
                number: v.inscription.number,
                utxo: v.utxo,
                value: v.inscription.value,
                sat: v.inscription.sat,
                mintTime: v.inscription.timestamp,
                genesesAddress: v.inscription.genesesaddress,
            })) || [],
        [data],
    );
    const total = useMemo(() => data?.data?.total || 0, [data]);

    const getNfts = async () => {
        setLoading(true);
        const resp = await getOrdInscriptionsByAddress({
            address,
            network,
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
        if (address) {
            getNfts();
        }
    }, [address, network, start, limit]);

    return (
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
    );
};
