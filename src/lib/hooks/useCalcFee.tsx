import { useMemo } from 'react';
export const useCalcFee = ({
  feeRate,
  inscriptionSize,
  files,
}: {
  feeRate: number;
  inscriptionSize: number;
  files: any[];
}) => {
  const { VITE_TIP_STATUS, VITE_TIP_MIN = 1000 } = import.meta.env;
  const serviceStatus = VITE_TIP_STATUS === '1';
  const clacFee = useMemo(() => {
    const base_size = 157;
    const feeObj: any = {
      networkFee: 0,
      serviceFee: 0,
      serviceText: '',
      totalFee: 0,
    };
    if (files?.length === 1) {
      feeObj.networkFee = files[0].txsize * feeRate;
      if (serviceStatus) {
        feeObj.networkFee += 50 * feeRate;
      }
      let totalFee = feeObj.networkFee + inscriptionSize;
      if (serviceStatus) {
        const oneFee = Math.max(Number(VITE_TIP_MIN), Math.ceil(inscriptionSize * 0.1));
        feeObj.serviceFee = Math.ceil(oneFee * files.length);
        feeObj.serviceText = `${oneFee} * ${files.length} = ${feeObj.serviceFee}`;
        totalFee += feeObj.serviceFee;
      }
      feeObj.totalFee = totalFee;
    } else {
      let totalInscriptionFee = 0;
      for (let i = 0; i < files.length; i++) {
        totalInscriptionFee += files[i].txsize * feeRate;
      }
      const networkFee =
        (base_size + 34 * (files.length + (serviceStatus ? 1 : 0)) + 10) *
          feeRate +
        totalInscriptionFee;
      let totalFee = networkFee + inscriptionSize * files.length;
      feeObj.networkFee = networkFee;
      if (serviceStatus) {
        const oneFee = Math.max(Number(VITE_TIP_MIN), Math.ceil(inscriptionSize * 0.1));
        feeObj.serviceFee = Math.ceil(oneFee * files.length);
        feeObj.serviceText = `${oneFee} X ${files.length} = ${feeObj.serviceFee}`;
        totalFee += feeObj.serviceFee;
      }
      feeObj.totalFee = totalFee;
    }
    return feeObj;
  }, [feeRate, inscriptionSize, files]);
  return clacFee;
};
