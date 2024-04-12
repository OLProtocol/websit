import { Icon } from '@iconify/react';
import { Tooltip } from 'antd';
import { useToast } from '@chakra-ui/react';
import { ROUTE_PATH } from '@/router';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUnisatConnect } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { getUtxo, getUtxoByValue } from '@/api';
import { calculateRate } from '@/lib/utils';
import { useCommonStore } from '@/store';

interface SatItemProps {
    id: string;
    start: number;
    size: number;
    offset: number;
}

export const SplitSatButton = ({
    sat,
    tooltip,
}: {
    sat: SatItemProps;
    tooltip?: string;
}) => {
    const nav = useNavigate();
    const { network, currentAccount } = useUnisatConnect();
    const [address, setAddress] = useState('');
    const [utxoValue, setUtxoValue] = useState(0);
    const [availableUtxos, setAvailableUtxos] = useState<any[]>();
    const [inputList, setInputList] = useState<any[]>() || [];
    const [outputList, setOutputList] = useState<any[]>() || [];
    const { feeRate } = useCommonStore((state) => state);
    const [fee, setFee] = useState(0);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const utxo = params.get('utxo');
    const start = Number(params.get('start'));
    const size = Number(params.get('size'));
    const offset = Number(params.get('offset'));

    const clickHandler = () => {
        nav(ROUTE_PATH.TOOLS_SPLIT_SAT + '?utxo=' + sat.id + '&start=' + sat.start + '&size=' + sat.size + '&offset=' + sat.offset);
    }

    const toTransact = () => {
        nav(ROUTE_PATH.TOOLS_TRANSACT, { state: { initInputList: [], initOutputList: [] } });
    }

    const getValueOfUtxo = async () => {
        const resp = await getUtxo({
            utxo,
            network,
        });
        if (resp.code === 0) {
            setUtxoValue(Number(resp.data.detail.value));
        }
    }


    const getAvailableUtxos = async () => {
        if (!address) {
            return
        }

        const resp = await getUtxoByValue({
            address,
            network,
            //   value: 10,
            value: 0,
        });
        if (resp.code === 0) {
            setAvailableUtxos(resp.data.filter((v) => v.value >= 330).sort((a, b) => a.value - b.value));// 排序：小->大
        }

    };

    useEffect(() => {
        if (utxoValue === undefined || utxoValue === 0) {
            return
        }
        if (availableUtxos === undefined) {
            return
        }

        // let availableUtxoIndex = 0;
        let tmpInputList: any[] = [];
        let tmpOutputList: any[] = [];

        let tmpAvailableUtxos = availableUtxos;
        let utxoLength = tmpAvailableUtxos?.length;

        if (offset === 0) {
            tmpInputList.push({ // 第一个输入
                utxo: utxo,
                sats: utxoValue,
            })

            tmpOutputList.push({ // 输出：包含稀有聪
                sats: size > 330 ? size : 330,
            });

            let inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            while (inTotal < 330) {// 输入的sats小于330，需要额外添加utxo
                tmpInputList.push({
                    utxo: tmpAvailableUtxos?.[utxoLength - 1].txid + ':' + tmpAvailableUtxos?.[utxoLength - 1].vout,
                    sats: tmpAvailableUtxos?.[utxoLength - 1].value,
                })
                tmpAvailableUtxos.splice(utxoLength - 1, 1);// 删除utxo
                utxoLength = tmpAvailableUtxos.length;
                inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            }
        } else if (offset < 330) {
            let inTotal = offset
            while (inTotal < 330) {
                tmpInputList.push({
                    utxo: tmpAvailableUtxos?.[0].txid + ':' + tmpAvailableUtxos?.[0].vout,
                    sats: tmpAvailableUtxos?.[0].value,
                })
                tmpAvailableUtxos.splice(0, 1);// 删除utxo
                utxoLength = tmpAvailableUtxos.length;
                inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0) + offset;
            }

            tmpOutputList.push({
                sats: tmpInputList.reduce((total, item) => total + item.sats, 0) + offset,
            })

            tmpInputList.push({
                utxo: utxo,
                sats: utxoValue,
            })

            tmpOutputList.push({ // 输出：包含稀有聪
                sats: size > 330 ? size : 330,
            })

            inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            while (inTotal < 330) {// 输入的sats小于330，需要额外添加utxo
                tmpInputList.push({
                    utxo: tmpAvailableUtxos?.[utxoLength - 1].txid + ':' + tmpAvailableUtxos?.[utxoLength - 1].vout,
                    sats: tmpAvailableUtxos?.[utxoLength - 1].value,
                })
                tmpAvailableUtxos.splice(utxoLength - 1, 1);// 删除utxo
                utxoLength = tmpAvailableUtxos.length;
            }

        } else if (offset >= 330) {
            tmpInputList.push({
                utxo: utxo,
                sats: utxoValue,
            })

            tmpOutputList.push({
                sats: offset,
            });

            tmpOutputList.push({ // 输出：包含稀有聪
                sats: size > 330 ? size : 330,
            })

            let inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            while (inTotal < 330) {// 输入的sats小于330，需要额外添加utxo
                tmpInputList.push({
                    utxo: tmpAvailableUtxos?.[utxoLength - 1].txid + ':' + tmpAvailableUtxos?.[utxoLength - 1].vout,
                    sats: tmpAvailableUtxos?.[utxoLength - 1].value,
                })
                tmpAvailableUtxos.splice(utxoLength - 1, 1);// 删除utxo
                utxoLength = tmpAvailableUtxos.length;
                inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            }
        }

        let inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
        let outTotal = tmpOutputList.reduce((total, item) => total + item.sats, 0);
        let realityFee = calculateRate(tmpInputList.length, tmpOutputList.length, feeRate.value);

        while (inTotal - outTotal - realityFee < 0) {
            tmpInputList.push({
                utxo: tmpAvailableUtxos?.[utxoLength - 1].txid + ':' + availableUtxos?.[utxoLength - 1].vout,
                sats: tmpAvailableUtxos?.[utxoLength - 1].value,
            })
            tmpAvailableUtxos.splice(utxoLength - 1, 1);// 删除utxo
            utxoLength = tmpAvailableUtxos.length;

            inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            realityFee = calculateRate(tmpInputList.length, tmpOutputList.length + 1, feeRate.value);
        }

        tmpOutputList.push({
            sats: inTotal - outTotal - realityFee,
        })

        setInputList(tmpInputList);
        setOutputList(tmpOutputList);
        setFee(realityFee);
    }, [utxoValue, availableUtxos]);


    useEffect(() => {
        setAddress(currentAccount);
        getAvailableUtxos();
        getValueOfUtxo();
    }, [address]);


    return (
        <Tooltip title={tooltip}>
            <Icon
                icon='game-icons:miner'
                className={`text-gray-500 text-lg pt-1`}
                onClick={toTransact}></Icon>
        </Tooltip>
    );
};
