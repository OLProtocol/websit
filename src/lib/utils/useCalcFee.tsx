import { useMemo } from 'react';
export const useCalcFee = ({
  feeRate,
  inscriptionSize,
  files,
  serviceStatus,
}: {
  feeRate: number;
  serviceStatus: number;
  inscriptionSize: number;
  files: any[];
}) => {
  const { VITE_TIP_MIN = 1000 } = import.meta.env;
  const clacFee = useMemo(() => {
    const base_size = 180;
    const feeObj: any = {
      networkFee: 0,
      serviceFee: 0,
      serviceStatus,
      totalFee: 0,
    };
    if (files?.length === 1) {
      feeObj.networkFee = files[0].txsize * feeRate;
      if (serviceStatus) {
        feeObj.networkFee += 50 * feeRate;
      }
      let totalFee = feeObj.networkFee + inscriptionSize;
      if (serviceStatus) {
        const oneFee = Math.max(
          Number(VITE_TIP_MIN),
          Math.ceil(inscriptionSize * 0.1),
        );
        feeObj.serviceFee = Math.ceil(oneFee * files.length);
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
        base_size * files.length +
        totalInscriptionFee;
      let totalFee = networkFee + inscriptionSize * files.length;
      feeObj.networkFee = networkFee;
      if (serviceStatus) {
        const oneFee = Math.max(
          Number(VITE_TIP_MIN),
          Math.ceil(inscriptionSize * 0.1),
        );
        feeObj.serviceFee = Math.ceil(oneFee * files.length);
        totalFee += feeObj.serviceFee;
      }
      feeObj.totalFee = totalFee;
    }
    return feeObj;
  }, [feeRate, inscriptionSize, files]);
  return clacFee;
};
