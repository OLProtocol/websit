import indexer from '@/api/indexer';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { addressToScriptPublicKey, calculateRate } from '@/lib/utils';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, FormControl, Grid, GridItem, Heading, Input, InputGroup, InputLeftAddon, InputRightAddon, Stack, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as bitcoin from 'bitcoinjs-lib';
import { useCommonStore } from '@/store';

export default function SplitSat() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const utxo = params.get('utxo');
    const start = Number(params.get('start'));
    const size = Number(params.get('size'));
    const offset = Number(params.get('offset'));

    const [loading, setLoading] = useState(false);
    const { network, address: currentAccount, btcWallet } = useReactWalletStore();
    const [address, setAddress] = useState('');
    const toast = useToast();
    const [availableUtxos, setAvailableUtxos] = useState<any[]>();
    const [inputList, setInputList] = useState<any[]>() || [];
    const [outputList, setOutputList] = useState<any[]>() || [];
    const [utxoValue, setUtxoValue] = useState(0);
    const { feeRate } = useCommonStore((state) => state);
    const [fee, setFee] = useState(0);

    const splitHandler = async () => {
        if (!currentAccount || !btcWallet) {
            return;
        }
        setLoading(true);

        try {
            const psbtNetwork = network === "testnet"
                ? bitcoin.networks.testnet
                : bitcoin.networks.bitcoin;
            const psbt = new bitcoin.Psbt({
                network: psbtNetwork,
            });
            inputList?.map((v) => {
                psbt.addInput({
                    hash: v.value.utxo.split(':')[0],
                    index: Number(v.value.utxo.split(':')[1]),
                    witnessUtxo: {
                        script: Buffer.from(addressToScriptPublicKey(currentAccount), 'hex'),
                        value: v.value.sats,
                    },
                })
            })

            outputList?.map((v) => {
                psbt.addOutput({
                    address: v.value.address,
                    value: v.value.sats,
                })
            })

            const signed = await btcWallet.signPsbt(psbt.toHex());
            if (!signed) {
                throw new Error('Sign failed');
            }
            const pushedTxId = await btcWallet.pushPsbt(signed);
            const signedToPsbt = bitcoin.Psbt.fromHex(signed, {
                network: psbtNetwork,
            });

            const txHex = signedToPsbt.extractTransaction().toHex();
            setLoading(false);
            toast({
                title: 'Split success',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error: any) {
            console.log('error = ', error);
            setLoading(false);
            toast({
                title: error.message || 'Split failed',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const getValueOfUtxo = async () => {
        if (!utxo) {
            return
        }
        setLoading(true);
        try {
            const resp = await indexer.utxo.getAssetList(utxo);
            setUtxoValue(Number(resp.data.detail.value));
        } catch (error: any) {
            toast({
                title: error.msg,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    const getAvailableUtxos = async () => {
        if (!address) {
            return
        }
        setLoading(true);
        try {
            const resp = await indexer.utxo.getPlainUtxoList({ address, value: 0 });
            setAvailableUtxos(resp.data.filter((v) => v.value >= 330).sort((a, b) => a.value - b.value));// 排序：小->大
        } catch (error: any) {
            toast({
                title: error.msg,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
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
        const tmpInputList: any[] = [];
        const tmpOutputList: any[] = [];

        const tmpAvailableUtxos = availableUtxos;
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
        const outTotal = tmpOutputList.reduce((total, item) => total + item.sats, 0);
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
    }, [address, feeRate]);

    return (
        <div className='flex flex-col max-w-7xl mx-auto pt-8'>
            <Card>
                <CardHeader>
                    <Heading size='md'>拆分</Heading>
                </CardHeader>
                <Divider borderColor={'teal.500'} />
                <CardBody>
                    <Stack>
                        <Flex>
                            <Heading flex={8} as='h6' size='sm'>Input</Heading>
                        </Flex>
                        <FormControl>
                            {inputList?.map((item) => (
                                <Grid key={Math.random()} templateColumns='repeat(5, 1fr)' gap={6} pt={2}>
                                    <GridItem colSpan={3}>
                                        <InputGroup>
                                            <InputLeftAddon>UTXO</InputLeftAddon>
                                            <Input key={Math.random()} value={item.utxo} readOnly />
                                        </InputGroup>
                                    </GridItem>

                                    <GridItem colSpan={2}>
                                        <InputGroup>
                                            <Input key={Math.random()} size='md' value={item.sats} readOnly />
                                            <InputRightAddon>sats</InputRightAddon>
                                        </InputGroup>
                                    </GridItem>
                                </Grid>
                            ))}
                        </FormControl>
                    </Stack>
                    <Divider borderColor={'teal.500'} mt={4} mb={4} />
                    <Stack>
                        <Flex>
                            <Heading flex={8} as='h6' size='sm'>Output</Heading>
                        </Flex>
                        <FormControl>
                            {outputList?.map((item) => (
                                <Grid key={Math.random()} templateColumns='repeat(5, 1fr)' gap={6} pt={2}>
                                    <GridItem colSpan={3}>
                                        <InputGroup>
                                            <InputLeftAddon>Btc Address</InputLeftAddon>
                                            <Input key={Math.random()} size='md' value={currentAccount} readOnly />
                                        </InputGroup>
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <InputGroup>
                                            <Input key={Math.random()} size='md' value={item.sats} readOnly />
                                            <InputRightAddon>sats</InputRightAddon>
                                        </InputGroup>
                                    </GridItem>
                                </Grid>
                            ))}
                        </FormControl>
                    </Stack>
                </CardBody>
                <Divider borderColor={'teal.500'} />
                <CardFooter>
                    <Button variant='solid' colorScheme='teal' onClick={splitHandler} isLoading={loading}>Split</Button>
                    <Button variant='ghost' colorScheme='teal'>({'Fee: ' + fee + ' sats'})</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
