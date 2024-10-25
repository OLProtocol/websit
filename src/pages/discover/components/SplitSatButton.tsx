import { Icon } from '@iconify/react';
import { Tooltip } from 'antd';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import indexer from '@/api/indexer';
import { calculateRate } from '@/lib/utils';
import { useCommonStore } from '@/store';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';

interface SatItemProps {
    utxo: string;
    size: number;
    offset: number;
    satributes: any;
}

export const SplitSatButton = ({
    sat,
    tooltip,
}: {
    sat: SatItemProps;
    tooltip?: string;
}) => {
    const nav = useNavigate();
    const { t } = useTranslation();
    const toast = useToast();
    const { network, address: currentAccount } = useReactWalletStore();
    const { feeRate } = useCommonStore((state) => state);

    // const utxo = sat.utxo;
    const size = sat.size;
    const offset = sat.offset;

    const toTransact = async () => {
        const { inputList, outputList } = await generateInputsAndOutputs();
        if (inputList.length > 0) {
            nav(ROUTE_PATH.TOOLS_TRANSACT, { state: { initInputList: inputList, initOutputList: outputList } });
        }
    }

    const getValueOfUtxo = async () => {
        let value = 0;
        const resp = await indexer.utxo.getAssetList(sat.utxo);
        if (resp.code === 0) {
            value = Number(resp.data.detail.value);
        }
        return value;
    }

    const getAvailableUtxos = async () => {
        let availableUtxos: any[] = [];
        const resp = await indexer.utxo.getPlainUtxoList({
            address: currentAccount,
            value: 0,
        });
        if (resp.code === 0) {
            availableUtxos = resp.data.filter((v) => v.value >= 330).sort((a, b) => a.value - b.value);// 排序：小->大
        }
        return availableUtxos;
    };

    const generateInputsAndOutputs = async () => {
        const utxoValue = await getValueOfUtxo();

        const inputList: any[] = [];
        const outputList: any[] = [];

        const availableUtxos = await getAvailableUtxos();
        let utxoLength = availableUtxos.length;

        const rareSatType = sat.satributes[0];

        if (offset === 0) {
            inputList.push({ // 第一个输入
                utxo: sat.utxo,
                sats: utxoValue,
                ticker: t('pages.tools.transaction.rare_sats') + '-' + rareSatType,
            })

            outputList.push({ // 第一个输出：包含稀有聪 -- offset=0
                sats: size > 330 ? size : 330,
                address: currentAccount,
            });

            let inTotal = inputList.reduce((total, item) => total + item.sats, 0);
            while (inTotal < 330) {// 输入的sats小于330，需要额外添加utxo
                if (utxoLength === 0) {
                    toast({
                        title: 'There is no enough utxo.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    return { inputList: [], outputList: [] };
                }
                inputList.push({
                    utxo: availableUtxos?.[utxoLength - 1].txid + ':' + availableUtxos?.[utxoLength - 1].vout,
                    sats: availableUtxos?.[utxoLength - 1].value,
                    ticker: t('pages.tools.transaction.available_utxo'),
                })
                availableUtxos?.splice(utxoLength - 1, 1);// 删除utxo
                utxoLength = availableUtxos.length;
                inTotal = inputList.reduce((total, item) => total + item.sats, 0);
            }
        } else if (offset < 330) {
            let inTotal = offset
            while (inTotal < 330) {
                if (utxoLength === 0) {
                    toast({
                        title: 'There is no enough utxo.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    return { inputList: [], outputList: [] };
                }
                inputList.push({
                    utxo: availableUtxos?.[0].txid + ':' + availableUtxos?.[0].vout,
                    sats: availableUtxos?.[0].value,
                    ticker: t('pages.tools.transaction.available_utxo'),
                })
                availableUtxos?.splice(0, 1);// 删除utxo
                utxoLength = availableUtxos.length;
                inTotal = inputList.reduce((total, item) => total + item.sats, 0) + offset;
            }

            outputList.push({ // 第一个输出 -- 0<offset<330
                sats: inputList.reduce((total, item) => total + item.sats, 0) + offset,
                address: currentAccount,
            })

            inputList.push({
                utxo: sat.utxo,
                sats: utxoValue,
                ticker: t('pages.tools.transaction.rare_sats') + '-' + rareSatType,
            })

            outputList.push({ // 第二个输出：包含稀有聪 -- 0<offset<330
                sats: size > 330 ? size : 330,
                address: currentAccount,
            })

            inTotal = inputList.reduce((total, item) => total + item.sats, 0);
            while (inTotal < 330) {// 输入的sats小于330，需要额外添加utxo
                if (utxoLength === 0) {
                    toast({
                        title: 'There is no enough utxo.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    return { inputList: [], outputList: [] };
                }

                inputList.push({
                    utxo: availableUtxos?.[utxoLength - 1].txid + ':' + availableUtxos?.[utxoLength - 1].vout,
                    sats: availableUtxos?.[utxoLength - 1].value,
                    ticker: t('pages.tools.transaction.available_utxo'),
                })
                availableUtxos?.splice(utxoLength - 1, 1);// 删除utxo
                utxoLength = availableUtxos.length;
            }

        } else if (offset >= 330) {
            inputList.push({
                utxo: sat.utxo,
                sats: utxoValue,
                ticker: t('pages.tools.transaction.rare_sats') + '-' + rareSatType,
            })

            outputList.push({ // 第一个输出 -- offset>=330
                sats: offset,
                address: currentAccount,
            });

            outputList.push({ // 第二个输出：包含稀有聪
                sats: size > 330 ? size : 330,
                address: currentAccount,
            })

            let inTotal = inputList.reduce((total, item) => total + item.sats, 0);
            while (inTotal < 330) {// 输入的sats小于330，需要额外添加utxo
                if (utxoLength === 0) {
                    toast({
                        title: 'There is no enough utxo.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    return { inputList: [], outputList: [] };
                }
                inputList.push({
                    utxo: availableUtxos?.[utxoLength - 1].txid + ':' + availableUtxos?.[utxoLength - 1].vout,
                    sats: availableUtxos?.[utxoLength - 1].value,
                    ticker: t('pages.tools.transaction.available_utxo'),
                })
                availableUtxos?.splice(utxoLength - 1, 1);// 删除utxo
                utxoLength = availableUtxos.length;
                inTotal = inputList.reduce((total, item) => total + item.sats, 0);
            }
        }

        let inTotal = inputList.reduce((total, item) => total + item.sats, 0);
        const outTotal = outputList.reduce((total, item) => total + item.sats, 0);
        let realityFee = calculateRate(inputList.length, outputList.length, feeRate.value);

        while (inTotal - outTotal - realityFee < 0) {
            if (utxoLength === 0) {
                toast({
                    title: 'There is no enough utxo.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return { inputList: [], outputList: [] };
            }
            inputList.push({
                utxo: availableUtxos?.[utxoLength - 1].txid + ':' + availableUtxos?.[utxoLength - 1].vout,
                sats: availableUtxos?.[utxoLength - 1].value,
                ticker: t('pages.tools.transaction.available_utxo'),
            })
            availableUtxos?.splice(utxoLength - 1, 1);// 删除utxo
            utxoLength = availableUtxos.length;

            inTotal = inputList.reduce((total, item) => total + item.sats, 0);
            realityFee = calculateRate(inputList.length, outputList.length + 1, feeRate.value);
        }

        // outputList.push({
        //     sats: inTotal - outTotal - realityFee,
        //     address: currentAccount,
        // })

        return { inputList: inputList, outputList: outputList };
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
