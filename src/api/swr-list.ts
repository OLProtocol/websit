import { error } from 'console';
import * as request from './request';
import { getCommonUseSwrFunc } from './swr-util';

import {
  TokenInfoReq,
  AddressReq,
  TokenReq,
  SwrNameListInfo,
  NameListResp,
} from './types';

export const useFtList = ({ start, limit }) => {
  return getCommonUseSwrFunc(`ft-List-${start}-${limit}`, request.getStatusList, { start, limit })();
};

export const useNsList = ({ start, limit }: any) => {
  return getCommonUseSwrFunc(`ns-List-${start}-${limit}`, request.getNsList, { start, limit })();
};

export const useNftList = ({ start, limit }: any) => {
  return getCommonUseSwrFunc(`nft-List-${start}-${limit}`, request.getNftList, { start, limit })();
};
