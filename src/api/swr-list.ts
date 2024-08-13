import * as request from './request';
import { getCommonUseSwrFunc } from './swr-util';


export const useFtList = ({ start, limit }) => {
  return getCommonUseSwrFunc(`ft-List-${start}-${limit}`, request.getStatusList, { start, limit })();
};

export const useNameList = ({ start, limit }: any) => {
  return getCommonUseSwrFunc(`name-List-${start}-${limit}`, request.getNameList, { start, limit })();
};

export const useNftList = ({ start, limit }: any) => {
  return getCommonUseSwrFunc(`nft-List-${start}-${limit}`, request.getNftList, { start, limit })();
};
