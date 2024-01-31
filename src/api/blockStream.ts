import axios from 'axios';
import { Address, Signer, Tap, Tx, Script } from '@cmdcode/tapscript';
export const pushBTCpmt = async (rawtx, network) => {
  let txid;
  try {
    const result = await axios(
      `https://blockstream.info/${
        network === 'testnet' ? 'testnet/' : ''
      }api/tx`,
      { data: rawtx, method: 'POST' },
    );
    txid = result.data;
  } catch (error: any) {
    if (
      error?.response?.data?.indexOf('Transaction already in block chain') > -1
    ) {
      txid = Tx.util.getTxid(Tx.decode(rawtx));
    } else {
      throw error;
    }
  }

  return txid;
};
