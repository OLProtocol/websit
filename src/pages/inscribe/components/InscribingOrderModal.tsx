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
} from '@chakra-ui/react';
import { InscribeOrderItem } from './InscribeOrderItem';
import { useUnisat, useUnisatConnect } from '@/lib/hooks/unisat';
import { useOrderStore, OrderItemType } from '@/store';
import { loopTilAddressReceivesMoney, inscribe } from '../utils';
import { useEffect, useMemo, useState } from 'react';

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
  const toast = useToast();
  const { changeStatus, addTxid, findOrder } = useOrderStore((state) => state);
  const unisat = useUnisat();
  const [payStatus, setPayStatus] = useState(false);
  const { network } = useUnisatConnect();
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const order = useMemo(() => {
    return findOrder(orderId);
  }, [orderId]);
  const payOrder = async () => {
    if (!order) {
      return;
    }
    try {
      const txid = await unisat.sendBitcoin(
        order.inscriptionAddress,
        order.fee,
        {
          feeRate: order.feeRate,
        },
      );
      changeStatus(order.orderId, 'paid');
      console.log(txid);
      addTxid(order.orderId, txid);
      setActiveStep(2);
    } catch (error: any) {
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
    if (!order || payStatus) {
      return;
    }
    setPayStatus(true);
    await loopTilAddressReceivesMoney(order.inscriptionAddress, network, true);
    setActiveStep(3);
  };
  const inscribeHandler = async () => {
    if (!order?.txid || !order) {
      return;
    }
    try {
      await inscribe({
        secret: order.secret,
        text: order.files[0].text,
        network: network as any,
        txid: order.txid,
        vout: 0,
        fee: order.fee,
        toAddress: order.toAddress[0],
        inscribeFee: order.inscriptionSize,
      });
      changeStatus(orderId, 'inscribe_success');
      toast({
        title: 'Success',
        description: 'Inscribe Success',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      onClose?.();
      onFinished?.();
    } catch (error: any) {
      changeStatus(orderId, 'inscribe_success');
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
  const checkStatus = () => {
    if (order?.status === 'paid') {
      setActiveStep(2);
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
                    <span>{order?.fee}</span> <span> sats</span>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <Button colorScheme='blue' onClick={payOrder}>
                    Pay with Wallet
                  </Button>
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
                    isDisabled={!order?.txid || payStatus}
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
                  <Button colorScheme='blue' onClick={inscribeHandler}>
                    Inscribe
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Divider className='my-4' content='Files' />
          <div className='mb-2'>
            {order?.files?.map((item, index) => (
              <InscribeOrderItem
                key={index}
                label={index + 1}
                status={order?.status}
                value={item.text}
              />
            ))}
          </div>
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
