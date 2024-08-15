import useSWR from 'swr';
import * as request from './request';
import { getCommonUseSwrFunc } from './swr-util';
import { SwrTokenInfo, TokenInfoReq, TokenInfoResp } from './types';


export const useGetUtxo = ({ utxo }: any) => {
    return getCommonUseSwrFunc(`utxo-assets-${utxo}`, request.getUtxo, { utxo })();
};

export const useTokenInfo = ({ tick }: TokenInfoReq): SwrTokenInfo => {
    const resp = getCommonUseSwrFunc(`token-info-${tick}`, request.getTickInfo, { tick })();
    return { resp: resp.data as TokenInfoResp, isLoading: resp.isLoading, error: resp.error };
};