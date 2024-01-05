import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Box,
  useToast,
  Divider,
  VStack,
} from '@chakra-ui/react';
import { InscribeOrderItem } from './InscribeOrderItem';
import { useUnisat, useUnisatConnect } from '@/lib/hooks/unisat';
import { BusButton } from '@/components/BusButton';
import { useOrderStore, OrderItemType } from '@/store';
import {
  loopTilAddressReceivesMoney,
  inscribe,
  pushCommitTx,
  getFundingAddress,
  waitSomeSeconds,
} from '../utils';
import { useEffect, useMemo, useState } from 'react';
import { _0n } from '@cmdcode/crypto-utils/dist/const';

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
  const steps = [
    { title: 'Payment' },
    { title: 'Payment Result' },
    { title: 'Start Inscribing' },
  ];
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

  const unisat = useUnisat();
  const [payStatus, setPayStatus] = useState(false);
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const order = useMemo(() => {
    return findOrder(orderId);
  }, [orderId]);
  const fee = useMemo(() => {
    if (!order) {
      return 0;
    }
    const base_size = 157;
    const { feeRate, inscriptionSize, inscriptions } = order;
    if (inscriptions.length === 1) {
      return inscriptions[0].txsize * feeRate + inscriptionSize;
    } else {
      let totalInscriptionFee = 0;
      for (let i = 0; i < inscriptions.length; i++) {
        totalInscriptionFee += inscriptions[i].txsize * feeRate;
      }
      const networkFee =
        (base_size + 34 * inscriptions.length + 10) * feeRate +
        totalInscriptionFee;
      const fee = networkFee + inscriptionSize * inscriptions.length;

      totalInscriptionFee;
      return fee;
    }
  }, [order]);
  const payOrder = async () => {
    if (!order) {
      return;
    }
    setLoading(true);

    try {
      const { inscriptions, feeRate, inscriptionSize, secret, network } = order;
      console.log('fee', fee);
      console.log('feeRate', feeRate);
      if (inscriptions.length === 1) {
        const txid = await unisat.sendBitcoin(
          inscriptions[0].inscriptionAddress,
          fee,
          {
            feeRate: feeRate,
          },
        );
        const commitTx = {
          txid,
          outputs: [
            {
              vout: 0,
              amount: fee,
            },
          ],
        };
        setCommitTx(orderId, commitTx);
        changeStatus(orderId, 'paid');
        setActiveStep(2);
        setTimeout(() => {
          startInscribe();
        }, 0);
      } else {
        let funding = order.funding;
        if (!funding) {
          const fundingData = getFundingAddress(secret, network);
          // let totalInscriptionFee = 0;
          // for (let i = 0; i < inscriptions.length; i++) {
          //   totalInscriptionFee +=
          //     inscriptionSize + inscriptions[i].txsize * feeRate;
          // }
          // const fee =
          //   base_size * feeRate +
          //   totalInscriptionFee +
          //   inscriptionSize * inscriptions.length;
          // const total_fees =
          //   totalInscriptionFee +
          //   (69 + (inscriptions.length + 1) * 2 * 31 + 10) * feeRate +
          //   base_size * inscriptions.length +
          //   inscriptionSize * inscriptions.length;
          const txid = await unisat.sendBitcoin(fundingData.address, fee, {
            feeRate: feeRate,
          });
          funding = {
            txid,
            vout: 0,
            amount: fee,
            ...fundingData,
          };
          setFunding(orderId, funding);
        }

        await loopTilAddressReceivesMoney(funding.address, order.network, true);
        const commitData = await pushCommitTx({
          inscriptions,
          secret,
          network,
          funding,
          inscriptionSize,
          feeRate,
        });
        changeStatus(orderId, 'paid');
        setCommitTx(orderId, commitData);
        setActiveStep(2);
        setTimeout(() => {
          startInscribe();
        }, 0);
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
    setLoading(true);
    setPayStatus(true);
    if (order.inscriptions.length === 1) {
      await loopTilAddressReceivesMoney(
        order.inscriptions[0].inscriptionAddress,
        order.network,
        true,
      );
    }
    setActiveStep(3);
    setTimeout(() => {
      inscribeHandler()
    }, 0);
    setLoading(false);
  };
  const inscribeHandler = async () => {
    if (!(order && order.commitTx)) {
      return;
    }
    setLoading(true);
    try {
      console.log('order', order);
      const { commitTx } = order;
      let finishedNum = 0;
      for (let i = 0; i < order.inscriptions.length; i++) {
        const inscription = order.inscriptions[i];
        await loopTilAddressReceivesMoney(
          inscription.inscriptionAddress,
          order.network,
          true,
        );
        await waitSomeSeconds(2000);
        const txid = await inscribe({
          secret: order.secret,
          network: order.network as any,
          inscription,
          txid: commitTx.txid,
          vout: commitTx.outputs[i].vout,
          amount: commitTx.outputs[i].amount,
          toAddress: order.toAddress[0],
          inscribeFee: order.inscriptionSize,
        });
        addTxidToInscription(order.orderId, i, txid);
        changeStatus(orderId, 'inscribe_success');
        changeInscriptionStatus(order.orderId, i, 'inscribe_success');
        toast({
          title: 'Success',
          description: 'Inscribe Success',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
        finishedNum += 1;
      }
      if (finishedNum === order.inscriptions.length) {
        changeStatus(orderId, 'inscribe_success');
        onClose?.();
        onFinished?.();
      }
    } catch (error: any) {
      console.log(error);
      changeStatus(orderId, 'paid');
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
      setActiveStep(2);
    }
    if (order?.funding && order?.commitTx) {
      setActiveStep(2);
    }
    if (order?.status === 'inscribe_success') {
      setActiveStep(3);
    }
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
        <ModalHeader>Inscribing Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className='mb-4'>
            <Stepper index={activeStep}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink='0'>
                    <StepTitle>{step.title}</StepTitle>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </div>
          <div>
            {/* step one */}
            {activeStep === 1 && (
              <div>
                <div className='flex justify-between'>
                  <div>Fee Rate</div>
                  <div>
                    <span>{order?.feeRate}</span> <span> sate/vB</span>
                  </div>
                </div>
                <Divider className='my-2' />
                <div className='flex justify-between mb-4'>
                  <div>Total Fee</div>
                  <div>
                    <span>{fee}</span> <span> sats</span>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <BusButton>
                    <Button
                      colorScheme='blue'
                      isLoading={loading}
                      onClick={payOrder}>
                      Pay with Wallet
                    </Button>
                  </BusButton>
                </div>
              </div>
            )}
            {/* step two */}
            {activeStep === 2 && (
              <div>
                <div className='text-center mb-2'>
                  <div className='text-2xl font-bold'>Payment Result</div>
                  <div className='text-sm text-gray-400'>
                    Please wait for the payment to be confirmed.
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
                    colorScheme='blue'
                    isDisabled={payStatus}
                    isLoading={loading}
                    onClick={startInscribe}>
                    Start Inscribing
                  </Button>
                </div>
              </div>
            )}
            {/* step three */}
            {activeStep === 3 && (
              <div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>Inscribing</div>
                  <div className='text-sm text-gray-400'>
                    Please wait for the inscription to be confirmed.
                  </div>
                </div>
                <div className='flex justify-center mt-4'>
                  <Button
                    colorScheme='blue'
                    isLoading={loading}
                    onClick={inscribeHandler}>
                    Inscribe
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Divider className='my-4' content='Files' />
          <VStack className='mb-2' spacing='10px'>
            {order?.inscriptions?.map((item, index) => (
              <InscribeOrderItem
                key={index}
                label={index + 1}
                status={order?.status}
                value={item.text}
                address={item.inscriptionAddress}
              />
            ))}
          </VStack>
          {order?.createAt && (
            <div className='text-right text-sm text-gray-400'>
              Order created at {new Date(order?.createAt).toLocaleString()}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
