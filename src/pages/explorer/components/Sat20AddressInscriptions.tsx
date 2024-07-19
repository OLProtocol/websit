import { Input, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
// import { getInscriptionsByGenesesAddress } from '@/api';
import { CopyButton } from '@/components/CopyButton';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { hideStr, } from '@/lib/utils';
import {
    Card,
    CardBody,
    CardHeader,
    useToast,
} from '@chakra-ui/react';
import { generateMempoolUrl } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
const { Search } = Input;

export const Sat20AddressInscriptionList = () => {
    const { t } = useTranslation();
    const nav = useNavigate();
    const { address } = useParams();
    const [search, setSearch] = useState('');

    const { network } = useReactWalletStore();
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
                    const href = generateMempoolUrl({
                        network,
                        path: `tx/${txid}`,
                    });
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
                title: 'Address',
                dataIndex: 'address',
                key: 'value',
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
                address: v.inscription.address,
            })) || [],
        [data],
    );
    const total = useMemo(() => data?.data?.total || 0, [data]);

    const doSearch = () => {
        if (search === '') {
            return;
        }
        // getInscriptions(search);
    };

    // const getInscriptions = async (genesesAddress: string) => {
    //     setLoading(true);
    //     const resp = await getInscriptionsByGenesesAddress({
    //         address: genesesAddress,
    //         network,
    //         start,
    //         limit,
    //     });
    //     if (resp.code !== 0) {
    //         toast({
    //             title: resp.msg,
    //             status: 'error',
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //         setLoading(false);
    //         return;
    //     }
    //     setLoading(false);
    //     setData(resp);
    // };

    const paginationChange = (page: number, pageSize: number) => {
        setStart((page - 1) * pageSize);
        console.log(page, pageSize);
    };

    useEffect(() => {
        if (address) {
            // getInscriptions(address);
        }
    }, [address, network, start, limit]);

    return (
        <div className='flex flex-col max-w-7xl mx-auto'>
            <div className='flex justify-center mt-12 mb-12'>
                <Search
                    allowClear
                    placeholder='Geneses address'
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
                            defaultPageSize: 100,
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
