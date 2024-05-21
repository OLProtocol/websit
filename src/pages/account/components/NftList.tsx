import { Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getInscriptionsByAddress } from '@/api';
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
        nav(`/explorer/inscription/${inscriptionId}`);
    };

    const columns: ColumnsType<any> = useMemo(() => {
        const defaultColumn: any[] = [
            {
                title: t('common.inscriptionNumber'),
                dataIndex: 'number',
                key: 'value',
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
                key: 'value',
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
                            {hideStr(txid)}
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
                title: 'Fee',
                dataIndex: 'fee',
                key: 'value',
                align: 'center',
            },
            {
                title: 'Sat',
                dataIndex: 'sat',
                key: 'value',
                align: 'center',
            },
            {
                title: 'Geneses Address',
                dataIndex: 'genesesAddress',
                key: 'value',
                align: 'center',
                render: (t) => {
                    return (
                        <a
                            className='text-blue-500 cursor-pointer'
                            onClick={() => nav(`/explorer/inscriptions/${t}`)}>
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
                fee: v.inscription.fee,
                sat: v.inscription.sat,
                genesesAddress: v.inscription.genesesaddress,
            })) || [],
        [data],
    );
    const total = useMemo(() => data?.data?.total || 0, [data]);

    const getNfts = async () => {
        setLoading(true);
        const resp = await getInscriptionsByAddress({
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
                        defaultPageSize: 100,
                        total: total,
                        onChange: paginationChange,
                        showSizeChanger: false,
                    }}
                />
            </CardBody>
        </Card>
    );
};
