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
      totalFee: 0,
    };
    if (files?.length === 1) {
      feeObj.networkFee = files[0].txsize * feeRate;
      if (serviceStatus) {
        feeObj.networkFee += 50 * feeRate;
      }
      let totalFee = feeObj.networkFee + inscriptionSize;
      if (serviceStatus) {
        feeObj.serviceFee = Math.max(
          Number(VITE_TIP_MIN),
          Math.ceil(totalFee * 0.1),
        );
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
        feeObj.serviceFee = Math.max(
          Number(VITE_TIP_MIN),
          Math.ceil(totalFee * 0.1),
        );
        totalFee += feeObj.serviceFee;
      }
      feeObj.totalFee = totalFee;
    }
    return feeObj;
  }, [feeRate, inscriptionSize, files]);
  return clacFee;
};
