import { Icon } from '@iconify/react';
import { Tooltip } from 'antd';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getUtxo, getUtxoByValue } from '@/api';
import { calculateRate } from '@/lib/utils';
import { useCommonStore } from '@/store';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { useTranslation } from 'react-i18next';

interface SatItemProps {
    utxo: string;
    start: number;
    size: number;
    offset: number;
    satributes:any;
}

export const SplitSatButton = ({
    sat,
    tooltip,
}: {
    sat: SatItemProps;
    tooltip?: string;
}) => {
    const nav = useNavigate();
    // const { network, currentAccount } = useUnisatConnect();
    const { t } = useTranslation();
    const { network, address: currentAccount } = useReactWalletStore();
    const [inputList, setInputList] = useState<any[]>() || [];
    const [outputList, setOutputList] = useState<any[]>() || [];
    const { feeRate } = useCommonStore((state) => state);
    const [fee, setFee] = useState(0);

    // const utxo = sat.utxo;
    const start = sat.start;
    const size = sat.size;
    const offset = sat.offset;

    const clickHandler = () => {
        nav(ROUTE_PATH.TOOLS_SPLIT_SAT + '?utxo=' + sat.utxo + '&start=' + sat.start + '&size=' + sat.size + '&offset=' + sat.offset);
    }

    const toTransact = () => {
        generateInputsAndOutputs();
        if (inputList && outputList) {
            nav(ROUTE_PATH.TOOLS_TRANSACT, { state: { initInputList: inputList, initOutputList: outputList } });
        }
    }

    const getValueOfUtxo = async () => {
        let value = 0;
        const resp = await getUtxo({
            utxo: sat.utxo,
            network,
        });
        if (resp.code === 0) {
            value = Number(resp.data.detail.value);
        }
        return value;
    }

    const getAvailableUtxos = async () => {
        let availableUtxos: any[] = [];
        const resp = await getUtxoByValue({
            address: currentAccount,
            network,
            value: 0,
        });
        if (resp.code === 0) {
            availableUtxos = resp.data.filter((v) => v.value >= 330).sort((a, b) => a.value - b.value);// 排序：小->大
        }
        return availableUtxos;
    };

    const generateInputsAndOutputs = async() => {
        let utxoValue = await getValueOfUtxo();

        let tmpInputList: any[] = [];
        let tmpOutputList: any[] = [];

        let tmpAvailableUtxos = await getAvailableUtxos();
        let utxoLength = tmpAvailableUtxos.length;

        const rareSatType = sat.satributes[0];

        if (offset === 0) {
            tmpInputList.push({ // 第一个输入
                utxo: sat.utxo,
                sats: utxoValue,
                ticker:  t('pages.tools.transaction.rare_sats') + '-' + rareSatType,
            })

            tmpOutputList.push({ // 输出：包含稀有聪
                sats: size > 330 ? size : 330,
                address: currentAccount,
            });

            let inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            while (inTotal < 330) {// 输入的sats小于330，需要额外添加utxo
                tmpInputList.push({
                    utxo: tmpAvailableUtxos?.[utxoLength - 1].txid + ':' + tmpAvailableUtxos?.[utxoLength - 1].vout,
                    sats: tmpAvailableUtxos?.[utxoLength - 1].value,
                    ticker: t('pages.tools.transaction.available_utxo'),
                })
                tmpAvailableUtxos?.splice(utxoLength - 1, 1);// 删除utxo
                utxoLength = tmpAvailableUtxos.length;
                inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            }
        } else if (offset < 330) {
            let inTotal = offset
            while (inTotal < 330) {
                tmpInputList.push({
                    utxo: tmpAvailableUtxos?.[0].txid + ':' + tmpAvailableUtxos?.[0].vout,
                    sats: tmpAvailableUtxos?.[0].value,
                    ticker: t('pages.tools.transaction.available_utxo'),
                })
                tmpAvailableUtxos?.splice(0, 1);// 删除utxo
                utxoLength = tmpAvailableUtxos.length;
                inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0) + offset;
            }

            tmpOutputList.push({
                sats: tmpInputList.reduce((total, item) => total + item.sats, 0) + offset,
                address: currentAccount,
            })

            tmpInputList.push({
                utxo: sat.utxo,
                sats: utxoValue,
                ticker:  t('pages.tools.transaction.rare_sats') + '-' + rareSatType,
            })

            tmpOutputList.push({ // 输出：包含稀有聪
                sats: size > 330 ? size : 330,
                address: currentAccount,
            })

            inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            while (inTotal < 330) {// 输入的sats小于330，需要额外添加utxo
                tmpInputList.push({
                    utxo: tmpAvailableUtxos?.[utxoLength - 1].txid + ':' + tmpAvailableUtxos?.[utxoLength - 1].vout,
                    sats: tmpAvailableUtxos?.[utxoLength - 1].value,
                    ticker: t('pages.tools.transaction.available_utxo'),
                })
                tmpAvailableUtxos?.splice(utxoLength - 1, 1);// 删除utxo
                utxoLength = tmpAvailableUtxos.length;
            }

        } else if (offset >= 330) {
            tmpInputList.push({
                utxo: sat.utxo,
                sats: utxoValue,
                ticker:  t('pages.tools.transaction.rare_sats') + '-' + rareSatType,
            })

            tmpOutputList.push({
                sats: offset,
                address: currentAccount,
            });

            tmpOutputList.push({ // 输出：包含稀有聪
                sats: size > 330 ? size : 330,
                address: currentAccount,
            })

            let inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            while (inTotal < 330) {// 输入的sats小于330，需要额外添加utxo
                tmpInputList.push({
                    utxo: tmpAvailableUtxos?.[utxoLength - 1].txid + ':' + tmpAvailableUtxos?.[utxoLength - 1].vout,
                    sats: tmpAvailableUtxos?.[utxoLength - 1].value,
                    ticker: t('pages.tools.transaction.available_utxo'),
                })
                tmpAvailableUtxos?.splice(utxoLength - 1, 1);// 删除utxo
                utxoLength = tmpAvailableUtxos.length;
                inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            }
        }

        let inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
        let outTotal = tmpOutputList.reduce((total, item) => total + item.sats, 0);
        let realityFee = calculateRate(tmpInputList.length, tmpOutputList.length, feeRate.value);

        while (inTotal - outTotal - realityFee < 0) {
            tmpInputList.push({
                utxo: tmpAvailableUtxos?.[utxoLength - 1].txid + ':' + tmpAvailableUtxos?.[utxoLength - 1].vout,
                sats: tmpAvailableUtxos?.[utxoLength - 1].value,
                ticker: t('pages.tools.transaction.available_utxo'),
            })
            tmpAvailableUtxos?.splice(utxoLength - 1, 1);// 删除utxo
            utxoLength = tmpAvailableUtxos.length;

            inTotal = tmpInputList.reduce((total, item) => total + item.sats, 0);
            realityFee = calculateRate(tmpInputList.length, tmpOutputList.length + 1, feeRate.value);
        }

        tmpOutputList.push({
            sats: inTotal - outTotal - realityFee,
            address: currentAccount,
        })

        setInputList(tmpInputList);
        setOutputList(tmpOutputList);
        setFee(realityFee);
    }

    return (
        <Tooltip title={tooltip}>
            <Icon
                icon='game-icons:miner'
                className={`text-gray-500 text-lg pt-1`}
                onClick={toTransact}></Icon>
        </Tooltip>
    );
};
