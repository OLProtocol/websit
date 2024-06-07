import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Card, Steps, Divider, Button, Tag, Progress } from 'antd';
import { InscribeOrderItem } from './InscribeOrderItem';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { pollGetTxStatus } from '@/api';
import { BusButton } from '@/components/BusButton';
import { useOrderStore, OrderItemType } from '@/store';
import {
  inscribe,
  pushCommitTx,
  getFundingAddress,
  waitSomeSeconds,
  sendBTC,
} from '../utils';
import { generateMempoolUrl } from '@/lib/utils';
import { savePaidOrder } from '@/api';
import { useEffect, useMemo, useState } from 'react';
import { _0n } from '@cmdcode/crypto-utils/dist/const';
import { hideStr } from '@/lib/utils';
import { FeeShow } from './FeeShow';
import { useTranslation } from 'react-i18next';

interface InscribingOrderMdaolProps {
  show: boolean;
  orderId: string;
  // order: OrderItemType;
  onFinished?: () => void;
  onClose?: () => void;
}
export const InscribingOrderModal = ({
  show,
  orderId,
  onClose,
  onFinished,
}: InscribingOrderMdaolProps) => {
  const { t } = useTranslation();
  const [successPercent, setSuccessPercent] = useState(0);
  const steps = [
    { title: t('pages.inscribe.pay.step_one.name') },
    { title: t('pages.inscribe.pay.step_two.name') },
    { title: t('pages.inscribe.pay.step_three.name') },
    { title: t('pages.inscribe.pay.step_four.name') },
  ];
  const { address: currentAccount, publicKey } = useReactWalletStore();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const {
    changeStatus,
    setCommitTx,
    addTxidToInscription,
    findOrder,
    changeInscriptionStatus,
    setFunding,
  } = useOrderStore((state) => state);

  const [activeStep, setActiveStep] = useState(0);
  const order = useMemo(() => {
    return findOrder(orderId);
  }, [orderId]);
  const payOrder = async () => {
    if (!order) {
      return;
    }
    setLoading(true);

    try {
      const { inscriptions, feeRate, inscriptionSize, secret, network, fee } =
        order;
      if (inscriptions.length === 1) {
        let txid;
        if (order.ordxUtxo) {
          txid = await sendBTC({
            toAddress: inscriptions[0].inscriptionAddress,
            value: fee.totalFee,
            feeRate: feeRate,
            network: network,
            fromAddress: currentAccount,
            fromPubKey: publicKey,
            ordxUtxo: order.ordxUtxo,
          });
        } else {
          txid = await sendBTC({
            toAddress: inscriptions[0].inscriptionAddress,
            value: fee.totalFee,
            feeRate: feeRate,
            network: network,
            fromAddress: currentAccount,
            fromPubKey: publicKey,
          });
        }
        const commitTx = {
          txid,
          outputs: [
            {
              vout: 0,
              amount: fee.totalFee,
            },
          ],
        };
        setCommitTx(orderId, commitTx);
        changeStatus(orderId, 'paid');
        await waitSomeSeconds(1500);
        setLoading(false);
        setActiveStep(1);
        setTimeout(() => {
          startInscribe();
        }, 0);
      } else {
        let funding = order.funding;
        let fundingTxid = funding?.txid || '';
        if (!funding) {
          const fundingData = getFundingAddress(secret, network);
          // fundingTxid = await unisat.sendBitcoin(
          //   fundingData.address,
          //   fee.totalFee,
          //   {
          //     feeRate: feeRate,
          //   },
          // );
          fundingTxid = await sendBTC({
            toAddress: fundingData.address,
            value: fee.totalFee,
            feeRate: feeRate,
            network: network,
            fromAddress: currentAccount,
            fromPubKey: publicKey,
          });
          funding = {
            txid: fundingTxid,
            vout: 0,
            amount: fee.totalFee,
            ...fundingData,
          };
          setFunding(orderId, funding);
          changeStatus(orderId, 'paid');
        }
        setActiveStep(1);
        await waitSomeSeconds(1500);
        setLoading(false);
        setTimeout(() => {
          startInscribe();
        }, 0);
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      toast({
        title: 'Error',
        description: error.message || JSON.stringify(error),
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  };
  const startInscribe = async () => {
    if (!order) {
      return;
    }
    console.log(order);
    const {
      inscriptions,
      funding,
      feeRate,
      inscriptionSize,
      secret,
      network,
      fee,
    } = order;
    setLoading(true);
    if (inscriptions.length !== 1 && funding) {
      try {
        await pollGetTxStatus(funding.txid, order.network);
        // await loopTilAddressReceivesMoney(funding.address, order.network, true);
        const fundingData = getFundingAddress(secret, network);
        const _funding = {
          ...funding,
          ...fundingData,
        };
        const commitData = await pushCommitTx({
          inscriptions,
          secret,
          network,
          funding: _funding,
          serviceFee: fee.serviceFee,
          inscriptionSize,
          feeRate,
        });
        changeStatus(orderId, 'commit_success');
        setCommitTx(orderId, commitData);
        setActiveStep(2);
        changeStatus(orderId, 'inscribe_wait');
        await waitSomeSeconds(1000);
        setLoading(false);
        inscribeHandler();
      } catch (error: any) {
        console.log(error);
        try {
          await savePaidOrder({
            key: orderId,
            content: {
              order,
              address: currentAccount,
            },
          });
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
        changeStatus(orderId, 'commit_error');
        toast({
          title: 'Error',
          description: error.message || JSON.stringify(error),
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      }
    } else {
      setLoading(true);
      setActiveStep(2);
      changeStatus(orderId, 'inscribe_wait');
      await waitSomeSeconds(1000);
      setLoading(false);
      inscribeHandler();
    }
  };

  const inscribeHandler = async () => {
    if (!(order && order.commitTx)) {
      return;
    }
    try {
      setLoading(true);
      console.log('order', order);
      const { commitTx, fee } = order;
      let finishedNum = 0;
      const commitTxid = (commitTx.txid as any)?.data || commitTx.txid;
      await pollGetTxStatus(commitTxid, order.network);
      for (let i = 0; i < order.inscriptions.length; i++) {
        const inscription = order.inscriptions[i];
        await waitSomeSeconds(1500);
        // if (!inscription.txid) {
        const txid = await inscribe({
          secret: order.secret,
          network: order.network as any,
          inscription,
          file: inscription.file,
          txid: commitTxid,
          serviceFee: order.inscriptions.length === 1 ? fee.serviceFee : 0,
          vout: commitTx.outputs[i].vout,
          amount: commitTx.outputs[i].amount,
          toAddress: order.toAddress[0],
          inscribeFee: order.inscriptionSize,
          ordxUtxo: order.ordxUtxo,
        });
        addTxidToInscription(order.orderId, i, txid);
        // }
        changeStatus(orderId, 'inscribe_success');
        changeInscriptionStatus(order.orderId, i, 'inscribe_success');
        finishedNum += 1;
        setSuccessPercent(
          Math.floor((finishedNum / order.inscriptions.length) * 100),
        );
      }
      if (finishedNum === order.inscriptions.length) {
        changeStatus(orderId, 'inscribe_success');
        setActiveStep(3);
        onFinished?.();
        toast({
          title: 'Success',
          description: 'Inscribe Success',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      } else {
        changeStatus(orderId, 'inscribe_fail');
      }
      setLoading(false);
    } catch (error: any) {
      try {
        await savePaidOrder({
          key: orderId,
          content: {
            order,
            address: currentAccount,
          },
        });
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
      changeStatus(orderId, 'inscribe_fail');
      toast({
        title: 'Error',
        description: error.message || 'error',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  };
  const clacSuccessPercent = () => {
    const successNum =
      order?.inscriptions?.filter((v) => v.status === 'inscribe_success')
        .length || 0;
    const total = order?.inscriptions?.length || 0;
    setSuccessPercent(Math.floor((successNum / total) * 100));
  };
  const checkStatus = () => {
    if (order?.status === 'paid') {
      setActiveStep(1);
    }
    if (
      (order?.funding && order?.commitTx) ||
      order?.status === 'commit_error'
    ) {
      setActiveStep(1);
    }

    if (
      order?.status === 'inscribe_wait' ||
      order?.status === 'inscribe_fail'
    ) {
      setActiveStep(2);
    }
    if (order?.status === 'inscribe_success') {
      if (
        order?.inscriptions?.length > 1 &&
        order?.inscriptions?.some((v) => !v.txid)
      ) {
        setActiveStep(2);
      } else {
        setActiveStep(2);
      }
    }
  };

  const fundingAddressHref = (address?: string) => {
    if (!address || !order?.network) {
      return '';
    }
    return generateMempoolUrl({
      network: order?.network,
      path: `address/${address}`,
    });
  };

  useEffect(() => {
    checkStatus();
    clacSuccessPercent();
  }, []);
  const closeHandler = () => {
    onClose?.();
  };
  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size='3xl'
      isOpen={show}
      onClose={closeHandler}
      isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className='flex items-center'>
          <span className='mr-2'>Inscribing Order</span>
          <Tag color='error'>{order?.network}</Tag>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className='mb-4'>
            <Steps current={activeStep} items={steps} />
          </div>
          <div>
            {activeStep > 0 && (
              <>
                <Divider children={'进度'} style={{ margin: '0 0' }} />
                <div>
                  <Progress percent={successPercent} status='active' />
                </div>
              </>
            )}
            {/* step one */}
            {activeStep === 0 && order?.status !== 'timeout' && (
              <div>
                <div className='flex justify-center'>
                  <BusButton>
                    <Button type='primary' loading={loading} onClick={payOrder}>
                      {t('buttons.pay_wallet')}
                    </Button>
                  </BusButton>
                </div>
              </div>
            )}
            {/* step two */}
            {activeStep === 1 && (
              <div>
                <div className='text-center mb-2'>
                  <div className='text-2xl font-bold'>
                    {t('pages.inscribe.pay.step_two.name')}
                  </div>
                  <div className='text-sm text-gray-400'>
                    {t('pages.inscribe.pay.step_two.des')}
                  </div>
                </div>
                {order?.txid && (
                  <div className='flex justify-between mb-4'>
                    <div>Tx id</div>
                    <div>{order?.txid}</div>
                  </div>
                )}
                <div className='flex justify-center mt-4'>
                  <Button
                    type='primary'
                    loading={loading}
                    onClick={startInscribe}>
                    {t('buttons.start_inscribe')}
                  </Button>
                </div>
                <div className='text-amber-400 text-base text-center'>
                  {t('pages.inscribe.order.continue')}
                </div>
              </div>
            )}
            {/* step three */}
            {activeStep === 2 && (
              <div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {t('pages.inscribe.pay.step_three.name')}
                  </div>
                  <div className='text-sm text-gray-400'>
                    {t('pages.inscribe.pay.step_three.des')}
                  </div>
                </div>
                <div className='flex justify-center mt-4'>
                  <Button
                    type='primary'
                    loading={loading}
                    onClick={inscribeHandler}>
                    {t('buttons.inscribe')}
                  </Button>
                </div>
                <div className='text-amber-400 text-base text-center'>
                  {t('pages.inscribe.order.continue')}
                </div>
              </div>
            )}
            {activeStep === 3 && (
              <div>
                <div className='text-center mb-4'>
                  <div className='text-2xl font-bold'>
                    {t('pages.inscribe.pay.step_four.name')}
                  </div>
                  <div className='text-sm text-gray-400'>
                    {t('pages.inscribe.pay.step_four.des')}
                  </div>
                </div>
                <div className='max-h-[20rem] overflow-y-auto'>
                  {order?.inscriptions?.map((item, index) => (
                    <div key={index} className='flex justify-between mb-4'>
                      <div>
                        {t('pages.inscribe.pay.step_four.genesis_tx')}{' '}
                        {index + 1}
                      </div>
                      <a
                        className='text-blue-500 underline'
                        href={generateMempoolUrl({
                          network: order.network,
                          path: `tx/${item.txid}`,
                        })}
                        target='_blank'>
                        {hideStr(item.txid, 10)}
                      </a>
                    </div>
                  ))}
                </div>
                <div className='flex justify-center mt-4'>
                  <Button
                    type='primary'
                    loading={loading}
                    size='large'
                    onClick={closeHandler}>
                    {t('buttons.close')}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <FeeShow
            feeRate={order?.feeRate}
            inscriptionSize={order?.inscriptionSize}
            serviceFee={order?.fee.serviceFee}
            filesLength={order?.inscriptions.length}
            totalFee={order?.fee.totalFee}
            networkFee={order?.fee.networkFee}
          />

          <>
            <Divider children={t('common.account')} />
            <Card title='Funding Account' size='small'>
              {/* <div className='flex justify-between items-center mb-4'>
                <div>{t('common.secret')}</div>
                <div className='text-sm text-gray-500 break-all ml-4'>
                  {order?.secret}
                </div>
              </div> */}
              <div className='flex justify-between'>
                <div>{t('common.address')}</div>
                {order?.inscriptions?.length === 1 ? (
                  <a
                    className='text-blue-500 underline ml-4'
                    href={fundingAddressHref(
                      order?.inscriptions?.[0].inscriptionAddress,
                    )}
                    target='_blank'>
                    {hideStr(order?.inscriptions?.[0].inscriptionAddress, 10)}
                  </a>
                ) : (
                  <a
                    className='text-blue-500 underline ml-4'
                    href={fundingAddressHref(order?.funding?.address)}
                    target='_blank'>
                    {hideStr(order?.funding?.address, 10)}
                  </a>
                )}
              </div>
            </Card>
          </>
          <Divider children={t('pages.inscribe.pay.files')} />
          <div className='max-h-[20rem] overflow-y-auto'>
            <VStack className='mb-2' spacing='10px'>
              {order?.inscriptions?.map((item, index) => (
                <InscribeOrderItem
                  key={index}
                  label={index + 1}
                  status={item?.status}
                  value={item.file.show}
                  address={order.toAddress[0]}
                />
              ))}
            </VStack>
          </div>
          {order?.createAt && (
            <div className='text-right text-sm text-gray-400'>
              {t('pages.inscribe.pay.created_text')}{' '}
              {new Date(order?.createAt).toLocaleString('af')}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
