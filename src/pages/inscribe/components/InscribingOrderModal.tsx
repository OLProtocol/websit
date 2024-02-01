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
import { Card, Steps, Divider, Button, Tag } from 'antd';
import { InscribeOrderItem } from './InscribeOrderItem';
import { useUnisat, useUnisatConnect } from '@/lib/hooks/unisat';
import { pollGetTxStatus } from '@/api';
import { BusButton } from '@/components/BusButton';
import { useOrderStore, OrderItemType } from '@/store';
import {
  inscribe,
  pushCommitTx,
  getFundingAddress,
  waitSomeSeconds,
} from '../utils';
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
  const steps = [
    { title: t('pages.inscribe.pay.step_one.name') },
    { title: t('pages.inscribe.pay.step_two.name') },
    { title: t('pages.inscribe.pay.step_three.name') },
    { title: t('pages.inscribe.pay.step_four.name') },
  ];
  const { currentAccount } = useUnisatConnect();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const {
    changeStatus,
    setCommitTx,
    addTxidToInscription,
    findOrder,
    changeInscriptionStatus,
    setFunding,
    savePaidOrder,
  } = useOrderStore((state) => state);

  const unisat = useUnisat();
  const [payStatus, setPayStatus] = useState(false);
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
        const txid = await unisat.sendBitcoin(
          inscriptions[0].inscriptionAddress,
          fee.totalFee,
          {
            feeRate: feeRate,
          },
        );
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
        setActiveStep(1);
        setTimeout(() => {
          startInscribe();
        }, 0);
      } else {
        let funding = order.funding;
        let fundingTxid = funding?.txid || '';
        if (!funding) {
          const fundingData = getFundingAddress(secret, network);
          fundingTxid = await unisat.sendBitcoin(
            fundingData.address,
            fee.totalFee,
            {
              feeRate: feeRate,
            },
          );
          funding = {
            txid: fundingTxid,
            vout: 0,
            amount: fee.totalFee,
            ...fundingData,
          };
          setFunding(orderId, funding);
          changeStatus(orderId, 'paid');
        }
        setTimeout(() => {
          startInscribe();
        }, 0);
        setActiveStep(1);
      }
    } catch (error: any) {
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
    setLoading(false);
  };
  const startInscribe = async () => {
    if (!order || payStatus) {
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
        setTimeout(() => {
          startInscribe();
        }, 0);
        setLoading(true);
        setPayStatus(true);
        setActiveStep(2);
        changeStatus(orderId, 'inscribe_wait');
        setTimeout(() => {
          inscribeHandler();
        }, 0);
        setLoading(false);
      } catch (error: any) {
        console.log(error);
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
      setPayStatus(true);
      setActiveStep(2);
      changeStatus(orderId, 'inscribe_wait');
      setTimeout(() => {
        inscribeHandler();
      }, 0);
      setLoading(false);
    }
  };

  const inscribeHandler = async () => {
    if (!(order && order.commitTx)) {
      return;
    }
    setLoading(true);
    try {
      console.log('order', order);
      const { commitTx, fee } = order;
      let finishedNum = 0;
      const commitTxid = (commitTx.txid as any)?.data || commitTx.txid;
      await pollGetTxStatus(commitTxid, order.network);
      for (let i = 0; i < order.inscriptions.length; i++) {
        const inscription = order.inscriptions[i];

        await waitSomeSeconds(3000);
        if (!inscription.txid) {
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
          });
          addTxidToInscription(order.orderId, i, txid);
        }
        changeStatus(orderId, 'inscribe_success');
        changeInscriptionStatus(order.orderId, i, 'inscribe_success');
        finishedNum += 1;
      }
      console.log(finishedNum);
      if (finishedNum === order.inscriptions.length) {
        changeStatus(orderId, 'inscribe_success');
        setActiveStep(3);
        onFinished?.();
      } else {
        changeStatus(orderId, 'inscribe_fail');
      }
    } catch (error: any) {
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
    setLoading(false);
  };
  const checkStatus = () => {
    console.log(order);
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
        setActiveStep(3);
      }
    }
  };
  const commitTxHref = useMemo(() => {
    if (!order?.commitTx) {
      return '';
    }
    const { txid } = order.commitTx;
    return `https://mempool.space/testnet/tx/${txid}`;
  }, [order?.commitTx]);
  // const fundingAddress = useMemo(() => {
  //   if (!order?.secret) {
  //     return '';
  //   }
  //   const address  = getAddressBySescet(order.secret, order.network);
  //   console.log(address);
  //   return address;
  // }, [order?.secret, order?.network]);
  const fundingAddressHref = (address: string) => {
    return `https://mempool.space${
      order?.network === 'testnet' ? '/testnet' : ''
    }/address/${address}`;
  };
  useEffect(() => {
    checkStatus();
  }, []);
  const closeHandler = () => {
    onClose?.();
  };
  return (
    <Modal size='3xl' isOpen={show} onClose={closeHandler} isCentered>
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
            {/* step one */}
            {activeStep === 0 && (
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
                    disabled={payStatus}
                    loading={loading}
                    onClick={startInscribe}>
                    {t('buttons.start_inscribe')}
                  </Button>
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
                <div>
                  {order?.inscriptions?.map((item, index) => (
                    <div key={index} className='flex justify-between mb-4'>
                      <div>
                        {t('pages.inscribe.pay.step_four.genesis_tx')}{' '}
                        {index + 1}
                      </div>
                      <a
                        className='text-blue-500 underline'
                        href={`https://mempool.space${
                          order.network === 'testnet' ? '/testnet' : ''
                        }/tx/${item.txid}`}
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
              <div className='flex justify-between items-center mb-4'>
                <div>{t('common.secret')}</div>
                <div className='text-sm text-gray-500 break-all ml-4'>
                  {order?.secret}
                </div>
              </div>
              <div className='flex justify-between'>
                <div>{t('common.address')}</div>
                <a
                  className='text-blue-500 underline ml-4'
                  href={fundingAddressHref(
                    order?.inscriptions?.[0].inscriptionAddress,
                  )}
                  target='_blank'>
                  {hideStr(order?.inscriptions?.[0].inscriptionAddress, 10)}
                </a>
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
              {new Date(order?.createAt).toLocaleString()}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
